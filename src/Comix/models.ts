/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2026 Inkdex */

import type { SearchResultItem } from "@paperback/types";

// Settings → Site Address: comix.to or its other address, comix.ws (the same
// site). Each address has its own cookies, so its own checks and passes.
export const SITE_ADDRESSES = [
  { id: "comix.to", title: "comix.to" },
  { id: "comix.ws", title: "comix.ws" },
];

export function siteHost(): string {
  const id = Application.getState("site_address") as string | undefined;
  return SITE_ADDRESSES.some((address) => address.id === id) ? id! : "comix.to";
}

// The site's address, e.g. "https://comix.to".
export const siteUrl = (): string => `https://${siteHost()}`;

// comix's own check page ("Verify you're human"). Opened in the check browser
// it shows the check; once passed, comix sets its pass (the waf_pass cookie)
// and goes on to its home page.
export const checkPage = (): string => `${siteUrl()}/@waf/challenge?return=%2F`;
export const NO_IMAGE = "https://comix.to/images/no-poster.png";

// Answers that mean comix's own server had trouble (not a block or a check):
// the same request usually works moments later, so it's tried again.
export const SERVER_TROUBLE = [500, 502, 504, 520, 521, 522, 523, 524];

export const serverTroubleText = (what: string, status: number): string =>
  `comix's server didn't answer for ${what} (HTTP ${status}), even after 3 tries. ` +
  `That's on comix's end: try again in a few minutes, or switch Site Address to ` +
  `${siteHost() === "comix.to" ? "comix.ws" : "comix.to"} in Comix's settings.`;

// comix.to or comix.ws (or www.), with or without a leading dot.
export const isComixDomain = (domain: string): boolean =>
  /(^|\.)comix\.(to|ws)$/i.test(String(domain ?? "").replace(/^\./, ""));

export type SectionEntry = { id: string; title: string };

export const DISCOVERY_SECTIONS: SectionEntry[] = [
  { id: "trending_top", title: "Most Recent Popular" },
  { id: "follows_top", title: "Most Follows · New Comics" },
  { id: "popular", title: "Popular" },
  { id: "follow", title: "Most Followed" },
  { id: "recent", title: "Recent Comics" },
  { id: "trending_manga", title: "Trending Manga" },
  { id: "trending_wt", title: "Trending WebToons" },
  { id: "updatesHot", title: "Latest Updates HOT" },
  { id: "updatesNew", title: "Latest Updates NEW" },
  { id: "completed", title: "Completed" },
  { id: "genresSection", title: "Best of Genres" },
];

export type TagMap = Record<string, "included" | "excluded">;

export interface ApiResponse<T> {
  status: string;
  result: T;
}

export interface ResultManga {
  items: MangaItem[];
  meta?: { hasNext: boolean };
}

export interface MangaItem {
  hid: string;
  title: string;
  altTitles: string[];
  synopsis: string;
  poster: { medium?: string; large?: string } | null;
  type: string;
  year: number;
  status: string;
  latestChapter: number;
  finalChapter: number;
  chapterUpdatedAtFormatted: string;
  ratedAvg: number;
  followsTotal: number;
  contentRating: string;
  url: string;
  authors?: { title: string }[];
  artists?: { title: string }[];
  genres: { id: number; title: string }[];
  demographics: { id: number; title: string }[];
}

// Extras beyond SearchResultItem feed FeaturedCarouselItem; other item types strip them
export type MangaListItem = SearchResultItem & {
  publishDate: Date;
  supertitle: string;
  summary: string;
  infoItems: [{ symbol: string; text: string }, { symbol: string; text: string }];
};

export interface ChapterItem {
  id: number;
  mangaId: number;
  isOfficial: boolean;
  number: number;
  name: string;
  language: string;
  volume: number;
  votes: number;
  createdAtFormatted: string;
  url: string;
  group?: { name: string } | null;
}

export interface ChapterPageItems {
  baseUrl?: string;
  // `s: 1` marks a "v3" page: it needs `?v3` so the server sends its scramble headers.
  items: { url: string; width?: number; height?: number; s?: number }[];
  // Backup image domains the site's reader retries on, and this chapter's node.
  alt?: string[] | null;
  node?: string | null;
}

export interface OptionItem {
  id: string;
  title: string;
}

export type Metadata = {
  page: number;
};

export type SearchMetadata = {
  genres?: TagMap;
  formats?: TagMap;
  types?: TagMap;
  demographic?: TagMap;
  status?: TagMap;
  mode?: string[];
  minChap?: number;
  contentRating?: string[];
};
