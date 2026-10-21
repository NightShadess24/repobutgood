/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2026 NightShadess24 */
/* Adapted from the Paperback 0.8 MyAnimeList tracker (Paperback-iOS/extensions, GPL-3.0) */

// MyAnimeList tracker for Paperback 0.9: sign in (settings), link a manga
// (search), and reading a chapter updates your MyAnimeList list.

import {
  BasicRateLimiter,
  ContentRating,
  DiscoverSectionType,
  type Chapter,
  type ChapterReadActionQueueProcessingResult,
  type DiscoverSection,
  type DiscoverSectionItem,
  type ExtensionImpl,
  type Form,
  type MangaProgress,
  type Metadata,
  type PagedResults,
  type SearchQuery,
  type SearchResultItem,
  type SourceManga,
  type TrackedMangaChapterReadAction,
} from "@paperback/types";

import { MalProgressForm, MalSettingsForm, type ListStatusChange } from "./forms";
import type { MalListStatus, MalManga, MalPage } from "./models";
import type MyAnimeListConfig from "./pbconfig";
import {
  accessToken,
  addHistory,
  API,
  CLIENT_ID,
  dateOf,
  formBody,
  isLoggedIn,
  setSyncReport,
  setUser,
  wasSignedIn,
  type SyncLine,
  type SyncReport,
  type UpdateKind,
  type User,
} from "./session";

const DETAIL_FIELDS =
  "id,title,main_picture,alternative_titles,synopsis,mean,status,nsfw,media_type,num_chapters,num_volumes,genres,authors{first_name,last_name},my_list_status";
const SEARCH_FIELDS = "id,title,main_picture,media_type,start_date";
const PAGE_SIZE = 30;
// Answers from MyAnimeList's server being busy or down, not from your list.
const SERVER_DOWN = [502, 503, 504];

const trouble = (status: number): string =>
  SERVER_DOWN.includes(status)
    ? `MyAnimeList's server is busy or down right now (${status}). It isn't your account; try again in a few minutes`
    : `MyAnimeList answered ${status}`;

const STATUS: Record<string, string> = {
  finished: "Completed",
  currently_publishing: "Ongoing",
  not_yet_published: "Not yet published",
  on_hiatus: "Hiatus",
  discontinued: "Cancelled",
};
const MEDIA: Record<string, string> = {
  manga: "Manga",
  manhwa: "Manhwa",
  manhua: "Manhua",
  novel: "Novel",
  light_novel: "Light novel",
  one_shot: "One-shot",
  doujinshi: "Doujinshi",
  oel: "OEL",
};

const offsetOf = (metadata: Metadata | undefined) =>
  metadata &&
  typeof metadata === "object" &&
  !Array.isArray(metadata) &&
  typeof metadata.offset === "number"
    ? metadata.offset
    : 0;

const staffName = (node?: { first_name?: string; last_name?: string }) =>
  [node?.first_name, node?.last_name].filter(Boolean).join(" ").trim();

const LIST_SECTION = "list-reading";
const RANKINGS = [
  { id: "manga", title: "Top manga" },
  { id: "bypopularity", title: "Most popular" },
  { id: "manhwa", title: "Top manhwa" },
  { id: "manhua", title: "Top manhua" },
  { id: "favorite", title: "Most favorited" },
];
const CARD_FIELDS = "id,title,main_picture,media_type,mean,nsfw,list_status";

const ratingOf = (nsfw?: string) =>
  nsfw === "black"
    ? ContentRating.ADULT
    : nsfw === "gray"
      ? ContentRating.MATURE
      : ContentRating.EVERYONE;

/**
 * The number of the chapter that was read: the app's, or, when a source
 * doesn't number its chapters, read from the chapter's title or id
 * ("Chapter 12", "ch-12").
 */
export function chapterNumberOf(action: TrackedMangaChapterReadAction): number {
  for (const value of [action.chapterNum, action.readChapter?.chapNum]) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  for (const text of [action.readChapter?.title, action.chapterId, action.chapterSourceId]) {
    const match = /(?:^|[^a-z])(?:chapter|chap|ch)[\s._-]*(\d+(?:\.\d+)?)/i.exec(
      String(text ?? ""),
    );
    if (match) return Number(match[1]);
  }
  return 0;
}

export class MyAnimeListExtension implements ExtensionImpl<typeof MyAnimeListConfig> {
  rateLimiter = new BasicRateLimiter("rateLimiter", {
    numberOfRequests: 2,
    bufferInterval: 1,
    ignoreImages: true,
  });

  private queueTurn: Promise<unknown> = Promise.resolve();

  async initialise(): Promise<void> {
    this.rateLimiter.registerInterceptor();
  }

  // ── Requests ───────────────────────────────────────────────────────────

  /** A MyAnimeList API request: signed in when possible, else as the app. */
  private async api(
    path: string,
    init: { method?: string; body?: Record<string, string> } = {},
    needsLogin = false,
  ): Promise<{ status: number; json: unknown }> {
    const token = await accessToken();
    if (needsLogin && !token) throw new Error("Sign in to MyAnimeList in this tracker's settings");
    const headers: Record<string, string> = {
      accept: "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : { "x-mal-client-id": CLIENT_ID }),
    };
    if (init.body) headers["content-type"] = "application/x-www-form-urlencoded";
    // MyAnimeList's server sometimes answers 502–504 for a moment. Each of
    // these calls is safe to repeat (a GET, or a PUT/DELETE that sets the same
    // values), so try again after 3 s and then 6 s before giving up.
    const send = () =>
      Application.scheduleRequest({
        url: path.startsWith("http") ? path : `${API}${path}`,
        method: init.method ?? "GET",
        headers,
        body: init.body ? formBody(init.body) : undefined,
      });
    let [response, data] = await send();
    for (const wait of [3, 6]) {
      if (!SERVER_DOWN.includes(response.status)) break;
      await Application.sleep(wait);
      [response, data] = await send();
    }
    const text = Application.arrayBufferToUTF8String(data);
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }
    return { status: response.status, json };
  }

  private async fetchManga(mangaId: string, fields = DETAIL_FIELDS): Promise<MalManga | undefined> {
    const id = Number.parseInt(mangaId, 10);
    if (!Number.isFinite(id)) return undefined;
    const { status, json } = await this.api(`/manga/${id}?fields=${encodeURIComponent(fields)}`);
    if (status === 404) return undefined;
    if (status >= 400) throw new Error(trouble(status));
    return json as MalManga;
  }

  private async refreshUser(): Promise<void> {
    const { status, json } = await this.api("/users/@me", {}, true);
    if (status < 400) setUser(json as User);
  }

  private async saveListStatus(
    mangaId: string,
    change: ListStatusChange,
    title = `Manga ${mangaId}`,
  ): Promise<void> {
    const manual = (text: string) =>
      addHistory([{ at: new Date().toISOString(), kind: "manual", text: `${title}: ${text}` }]);
    const id = Number.parseInt(mangaId, 10);
    if (change.status === "remove") {
      const { status } = await this.api(`/manga/${id}/my_list_status`, { method: "DELETE" }, true);
      if (status >= 400 && status !== 404) throw new Error(trouble(status));
      manual("removed from your list by hand");
      return;
    }
    const { status } = await this.api(
      `/manga/${id}/my_list_status`,
      {
        method: "PUT",
        body: {
          status: change.status,
          num_chapters_read: String(Math.max(0, Math.floor(change.chapters))),
          num_volumes_read: String(Math.max(0, Math.floor(change.volumes))),
          score: String(Math.min(10, Math.max(0, Math.floor(change.score)))),
          num_times_reread: String(Math.max(0, Math.floor(change.rereads))),
          comments: change.notes,
        },
      },
      true,
    );
    if (status >= 400) throw new Error(`MyAnimeList didn't save the change (${status})`);
    manual(`chapter ${Math.max(0, Math.floor(change.chapters))} saved by hand`);
  }

  // ── Settings ───────────────────────────────────────────────────────────

  async getSettingsForm(): Promise<Form> {
    return new MalSettingsForm(() => this.refreshUser());
  }

  // ── Discover ───────────────────────────────────────────────────────────

  async getDiscoverSections(): Promise<DiscoverSection[]> {
    return [
      ...(isLoggedIn()
        ? [
            {
              id: LIST_SECTION,
              title: "Your reading list",
              type: DiscoverSectionType.simpleCarousel,
            },
          ]
        : []),
      ...RANKINGS.map(({ id, title }) => ({
        id: `ranking-${id}`,
        title,
        type: DiscoverSectionType.simpleCarousel,
      })),
    ];
  }

  async getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: Metadata | undefined,
  ): Promise<PagedResults<DiscoverSectionItem>> {
    const offset = offsetOf(metadata);
    const paging = `limit=${PAGE_SIZE}&offset=${offset}&fields=${encodeURIComponent(CARD_FIELDS)}`;
    const onList = section.id === LIST_SECTION;
    if (onList && !isLoggedIn()) return { items: [], metadata: undefined };
    const ranking = section.id.replace(/^ranking-/, "");
    const { status, json } = await this.api(
      onList
        ? `/users/@me/mangalist?status=reading&sort=list_updated_at&nsfw=true&${paging}`
        : `/manga/ranking?ranking_type=${encodeURIComponent(ranking)}&${paging}`,
      {},
      onList,
    );
    if (status >= 400) throw new Error(trouble(status));
    const page = json as MalPage;
    return {
      items: (page?.data ?? []).map(({ node, list_status, ranking: rank }) => ({
        type: "simpleCarouselItem" as const,
        mangaId: String(node.id),
        title: node.title,
        imageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? "",
        subtitle: onList
          ? `Chapter ${(list_status ?? node.my_list_status)?.num_chapters_read ?? 0}`
          : [rank?.rank ? `#${rank.rank}` : undefined, MEDIA[node.media_type ?? ""]]
              .filter(Boolean)
              .join(" · "),
        contentRating: ratingOf(node.nsfw),
      })),
      metadata: page?.paging?.next ? { offset: offset + PAGE_SIZE } : undefined,
    };
  }

  // ── Linking a manga ────────────────────────────────────────────────────

  async getSearchResults(
    query: SearchQuery<Metadata>,
    metadata: Metadata | undefined,
  ): Promise<PagedResults<SearchResultItem>> {
    const title = (query.title ?? "").trim();
    // MyAnimeList searches need at least three letters.
    if (title.length < 3) return { items: [], metadata: undefined };
    const offset = offsetOf(metadata);
    const { status, json } = await this.api(
      `/manga?q=${encodeURIComponent(title.slice(0, 64))}&limit=${PAGE_SIZE}&offset=${offset}&nsfw=true&fields=${encodeURIComponent(SEARCH_FIELDS)}`,
    );
    if (status >= 400) throw new Error(trouble(status));
    const page = json as MalPage;
    return {
      items: (page?.data ?? []).map(({ node }) => ({
        mangaId: String(node.id),
        title: node.title,
        imageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? "",
        subtitle: [MEDIA[node.media_type ?? ""], node.start_date?.slice(0, 4)]
          .filter(Boolean)
          .join(" · "),
      })),
      metadata: page?.paging?.next ? { offset: offset + PAGE_SIZE } : undefined,
    };
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    const manga = await this.fetchManga(mangaId);
    if (!manga) throw new Error(`MyAnimeList doesn't have manga ${mangaId}`);
    const titles = manga.alternative_titles;
    const author = manga.authors?.find((a) => /story/i.test(a.role ?? ""))?.node;
    const artist = manga.authors?.find((a) => /art/i.test(a.role ?? ""))?.node;
    return {
      mangaId: String(manga.id),
      mangaInfo: {
        primaryTitle: manga.title,
        secondaryTitles: [titles?.en, titles?.ja, ...(titles?.synonyms ?? [])].filter(
          (title): title is string => !!title && title !== manga.title,
        ),
        thumbnailUrl: manga.main_picture?.large ?? manga.main_picture?.medium ?? "",
        synopsis: manga.synopsis ?? "",
        contentRating: ratingOf(manga.nsfw),
        status: STATUS[manga.status ?? ""] ?? manga.status,
        author: staffName(author) || undefined,
        artist: staffName(artist) || undefined,
        rating: typeof manga.mean === "number" ? manga.mean / 10 : undefined,
        tagGroups: manga.genres?.length
          ? [
              {
                id: "genres",
                title: "Genres",
                tags: manga.genres.map((genre) => ({ id: String(genre.id), title: genre.name })),
              },
            ]
          : [],
        shareUrl: `https://myanimelist.net/manga/${manga.id}`,
      },
    };
  }

  // ── Progress ───────────────────────────────────────────────────────────

  async getMangaProgressManagementForm(sourceManga: SourceManga): Promise<Form> {
    if (!isLoggedIn()) return new MalProgressForm(undefined, async () => {});
    const manga = await this.fetchManga(sourceManga.mangaId);
    return new MalProgressForm(manga, (change) =>
      this.saveListStatus(sourceManga.mangaId, change, manga?.title),
    );
  }

  async getMangaProgress(sourceManga: SourceManga): Promise<MangaProgress | undefined> {
    if (!isLoggedIn()) return undefined;
    const manga = await this.fetchManga(sourceManga.mangaId, "id,my_list_status");
    const list = manga?.my_list_status;
    if (!list) return undefined;
    const read = list.num_chapters_read ?? 0;
    const lastReadChapter: Chapter = {
      chapterId: String(read),
      sourceManga,
      langCode: "unknown",
      chapNum: read,
      volume: list.num_volumes_read || undefined,
    };
    const updated = list.updated_at ? new Date(list.updated_at) : undefined;
    return {
      sourceManga,
      lastReadChapter,
      lastReadTime: updated && !Number.isNaN(updated.getTime()) ? updated : undefined,
      userRating: list.score || undefined,
    };
  }

  /** Reading a chapter moves your progress forward (never back). */
  async processChapterReadActionQueue(
    actions: TrackedMangaChapterReadAction[],
  ): Promise<ChapterReadActionQueueProcessingResult> {
    // One batch at a time: two at once could each read your list before the
    // other saved, and the older chapter would win.
    const turn = this.queueTurn.then(() => this.syncReadActions(actions));
    this.queueTurn = turn.catch(() => undefined);
    try {
      return await turn;
    } catch (error) {
      // Never throw back at the app: leave everything queued for next time.
      console.log(`[MyAnimeList] reading updates stopped: ${String(error)}`);
      return { successfulItems: [], failedItems: [] };
    }
  }

  private async syncReadActions(
    actions: TrackedMangaChapterReadAction[],
  ): Promise<ChapterReadActionQueueProcessingResult> {
    const result: ChapterReadActionQueueProcessingResult = { successfulItems: [], failedItems: [] };
    const report: SyncReport = {
      at: new Date().toISOString(),
      updated: 0,
      unchanged: 0,
      failed: 0,
    };
    const lines: SyncLine[] = [];
    let readAt: Date | undefined;
    const log = (kind: UpdateKind, message: string) => {
      lines.push({ text: message, readAt: readAt?.toISOString(), kind });
      console.log(`[MyAnimeList] ${message}`);
    };
    console.log(`[MyAnimeList] reading updates: ${actions.length}`);
    if (!isLoggedIn()) {
      if (wasSignedIn()) {
        // Signed in, but the sign-in can't be read right now (the phone is
        // locked, say): leave the updates queued so the app sends them again.
        report.error = "Couldn't read your MyAnimeList sign-in just now; will try again";
      } else {
        report.error = "Not signed in to MyAnimeList";
      }
      console.log(`[MyAnimeList] ${report.error}`);
      setSyncReport(report);
      return result;
    }
    const byManga = new Map<string, TrackedMangaChapterReadAction[]>();
    for (const action of actions) {
      const mangaId = String(action.sourceManga?.mangaId ?? "");
      byManga.set(mangaId, [...(byManga.get(mangaId) ?? []), action]);
    }
    for (const [mangaId, mangaActions] of byManga) {
      const ids = mangaActions.map((action) => action.id);
      // When the newest of these chapters was read, for the settings' timer.
      readAt = mangaActions
        .map((action) => dateOf(action.creationDate))
        .reduce<Date | undefined>(
          (newest, date) => (date && (!newest || date > newest) ? date : newest),
          undefined,
        );
      try {
        const chapter = Math.floor(Math.max(0, ...mangaActions.map(chapterNumberOf)));
        // A chapter whose title gives another number ("Chapter 133" for 128):
        // the source numbers its chapters its own way.
        const newest = mangaActions.find(
          (action) => Math.floor(chapterNumberOf(action)) === chapter,
        );
        const titled = /(?:^|[^a-z])(?:chapter|chap|ch)[\s._-]*(\d+(?:\.\d+)?)/i.exec(
          String(newest?.readChapter?.title ?? ""),
        );
        const titleSays =
          titled && Math.floor(Number(titled[1])) !== chapter
            ? ` (its title says chapter ${titled[1]})`
            : "";
        const volume = Math.max(
          0,
          ...mangaActions.map((action) => Math.floor(Number(action.chapterVolume ?? 0)) || 0),
        );
        if (chapter <= 0) {
          // Nothing to count (a chapter 0, or one without a number).
          log("same", `Manga ${mangaId}: the chapter has no number, so there's nothing to count`);
          result.successfulItems.push(...ids);
          report.unchanged++;
          continue;
        }
        const manga = await this.fetchManga(mangaId, "id,title,num_chapters,my_list_status");
        if (!manga) {
          log("failed", `Manga ${mangaId}: MyAnimeList doesn't have it (link it again)`);
          result.failedItems.push(...ids);
          report.failed++;
          report.error = `MyAnimeList doesn't have manga ${mangaId}`;
          continue;
        }
        const name = manga.title || `Manga ${mangaId}`;
        const list: MalListStatus = manga.my_list_status ?? {};
        if ((list.num_chapters_read ?? 0) >= chapter) {
          log(
            "same",
            `${name}: read chapter ${chapter}${titleSays}, your list is already at ${list.num_chapters_read}`,
          );
          result.successfulItems.push(...ids);
          report.unchanged++;
          continue;
        }
        const finished =
          manga.num_chapters !== undefined &&
          manga.num_chapters > 0 &&
          chapter >= manga.num_chapters;
        const body: Record<string, string> = {
          status: finished ? "completed" : list.status === "completed" ? "completed" : "reading",
          num_chapters_read: String(chapter),
        };
        if (volume > (list.num_volumes_read ?? 0)) body.num_volumes_read = String(volume);
        const { status, json } = await this.api(
          `/manga/${manga.id}/my_list_status`,
          { method: "PUT", body },
          true,
        );
        if (status < 400) {
          // What MyAnimeList kept: it won't go past the number of chapters
          // its entry lists, whatever is sent.
          const kept = (json as MalListStatus | undefined)?.num_chapters_read;
          if (typeof kept === "number" && kept < chapter) {
            log(
              "capped",
              `${name}: you read chapter ${chapter}${titleSays}, but MyAnimeList stopped at ${kept}` +
                (manga.num_chapters ? ` (its entry has ${manga.num_chapters} chapters)` : ""),
            );
          } else {
            log("saved", `${name}: chapter ${chapter} saved${titleSays}`);
          }
          result.successfulItems.push(...ids);
          report.updated++;
        } else {
          console.log(`[MyAnimeList] ${JSON.stringify(json ?? "").slice(0, 200)}`);
          log("failed", `${name}: MyAnimeList didn't save chapter ${chapter} (${status})`);
          result.failedItems.push(...ids);
          report.failed++;
          report.error = trouble(status);
        }
      } catch (error) {
        log(
          "failed",
          `Manga ${mangaId}: ${String((error as Error)?.message ?? error).slice(0, 160)}`,
        );
        result.failedItems.push(...ids);
        report.failed++;
        report.error = String((error as Error)?.message ?? error).slice(0, 200);
      }
    }
    report.lines = lines.slice(0, 8);
    setSyncReport(report);
    addHistory(
      lines.map(({ text, readAt: read, kind }) => ({
        at: report.at,
        text,
        readAt: read,
        kind: kind ?? "failed",
      })),
    );
    return result;
  }
}

export const MyAnimeList = new MyAnimeListExtension();
