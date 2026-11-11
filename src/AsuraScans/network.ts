/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */
/* Copyright © 2026 Kodama */

import {
  CloudflareError,
  PaperbackInterceptor,
  type Request,
  type Response,
} from "@paperback/types";

import { authorizedFetch } from "./auth";
import { ASURA_API, ASURA_DOMAIN } from "./models";

const MAX_REDIRECTS = 5;

function headerValue(headers: Record<string, string>, name: string): string | undefined {
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === name) return value;
  }
  return undefined;
}

function isAsuraUrl(url: string): boolean {
  return /^https?:\/\/([^/]+\.)?asurascans\.com(\/|$|\?)/i.test(url);
}

// Cloudflare marks a challenge with this header; older challenge pages only show in the body.
function isCloudflareChallenge(response: Response, data: ArrayBuffer): boolean {
  if (headerValue(response.headers ?? {}, "cf-mitigated") === "challenge") return true;
  if (response.status !== 403 && response.status !== 503) return false;

  const contentType = headerValue(response.headers ?? {}, "content-type") ?? "";
  if (!contentType.includes("text/html")) return false;

  const body = Application.arrayBufferToUTF8String(data);
  return body.includes("challenge-platform") || body.includes("_cf_chl_opt");
}

export class MainInterceptor extends PaperbackInterceptor {
  // The app's own user agent: Cloudflare ties its clearance cookie to the browser that passed
  // the challenge, which is the app's web view, so a made-up one is refused (HTTP 403).
  override async interceptRequest(request: Request): Promise<Request> {
    request.headers = {
      ...request.headers,
      "user-agent": await Application.getDefaultUserAgent(),
    };
    return request;
  }

  // Hands a Cloudflare challenge to the app, which opens the page for the reader to pass it
  // (cloudflareBypassCompleted in main.ts keeps the cookies it gives back).
  override async interceptResponse(
    request: Request,
    response: Response,
    data: ArrayBuffer,
  ): Promise<ArrayBuffer> {
    if (isAsuraUrl(request.url) && isCloudflareChallenge(response, data)) {
      const isGet = (request.method ?? "GET").toUpperCase() === "GET";
      throw new CloudflareError({
        url: isGet ? request.url : `${ASURA_DOMAIN}/`,
        method: "GET",
        headers: {
          "user-agent": await Application.getDefaultUserAgent(),
        },
      });
    }

    return data;
  }
}

function resolveLocation(location: string, base: string): string {
  if (location.startsWith("http://") || location.startsWith("https://")) return location;
  if (location.startsWith("/")) {
    // The redirecting host, which after an absolute redirect off-site is no longer ours.
    const origin = /^https?:\/\/[^/]+/.exec(base)?.[0] ?? ASURA_DOMAIN;
    return `${origin}${location}`;
  }
  return `${base.slice(0, base.lastIndexOf("/") + 1)}${location}`;
}

export type FetchedPage = {
  url: string;
  html: string;
};

type CachedPage = {
  fetchedAt: number;
  page: FetchedPage;
};

const PAGE_CACHE_TTL = 15_000;
const PAGE_CACHE_LIMIT = 6;

const pageCache = new Map<string, CachedPage>();
const inFlight = new Map<string, Promise<FetchedPage>>();

function cachedPage(url: string): FetchedPage | undefined {
  const entry = pageCache.get(url);
  if (!entry) return undefined;

  if (Date.now() - entry.fetchedAt > PAGE_CACHE_TTL) {
    pageCache.delete(url);
    return undefined;
  }

  return entry.page;
}

function rememberPage(url: string, page: FetchedPage): void {
  if (pageCache.size >= PAGE_CACHE_LIMIT) {
    const oldest = pageCache.keys().next().value;
    if (oldest !== undefined) pageCache.delete(oldest);
  }

  pageCache.set(url, { fetchedAt: Date.now(), page });
}

export async function fetchPage(url: string): Promise<FetchedPage> {
  const cached = cachedPage(url);
  if (cached) return cached;

  const pending = inFlight.get(url);
  if (pending) return pending;

  const request = requestPage(url);
  inFlight.set(url, request);

  try {
    const page = await request;
    rememberPage(url, page);
    return page;
  } finally {
    inFlight.delete(url);
  }
}

async function requestPage(url: string): Promise<FetchedPage> {
  let target = url;

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    const [response, data] = await Application.scheduleRequest({ url: target, method: "GET" });

    if (response.status >= 300 && response.status < 400) {
      const location = headerValue(response.headers, "location");
      if (!location) {
        throw new Error(`Asura Scans redirected ${target} without a location header`);
      }
      target = resolveLocation(location, target);
      continue;
    }

    // A Cloudflare challenge never gets here (MainInterceptor raises it for the app to solve).
    if (response.status === 403 || response.status === 503) {
      throw new Error(
        `Asura Scans refused the request (HTTP ${response.status}). Open the site in a browser, then try again.`,
      );
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Asura Scans returned HTTP ${response.status} for ${target}`);
    }

    return {
      url: response.url.length > 0 ? response.url : target,
      html: Application.arrayBufferToUTF8String(data),
    };
  }

  throw new Error(`Asura Scans redirected ${url} too many times`);
}

export type Creators = { authors: string[]; artists: string[] };

let creatorsCache: Creators | undefined;

// The advanced search author/artist filters draw from this list, on the API host
export async function fetchCreators(): Promise<Creators> {
  if (creatorsCache) return creatorsCache;

  const [response, data] = await Application.scheduleRequest({
    url: `${ASURA_API}/api/creators`,
    method: "GET",
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Asura Scans returned HTTP ${response.status} for the creators list`);
  }

  const parsed = JSON.parse(Application.arrayBufferToUTF8String(data)) as {
    data?: Partial<Creators>;
  } & Partial<Creators>;
  const source = parsed.data ?? parsed;

  creatorsCache = {
    authors: Array.isArray(source.authors) ? source.authors : [],
    artists: Array.isArray(source.artists) ? source.artists : [],
  };
  return creatorsCache;
}

// The chapter reader's early-access unlock is a separate, uncached JSON endpoint — the HTML page
// fetched by fetchPage above is a shared Cloudflare edge cache and never varies by auth
export async function fetchChapterJson(
  seriesSlug: string,
  chapterNumber: string,
): Promise<unknown> {
  const result = await authorizedFetch(`/api/series/${seriesSlug}/chapters/${chapterNumber}`);
  if (!result) return undefined;

  const [response, data] = result;
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Asura Scans returned HTTP ${response.status} for the authenticated chapter endpoint`,
    );
  }

  const parsed = JSON.parse(Application.arrayBufferToUTF8String(data)) as {
    data?: unknown;
  };
  return parsed.data ?? parsed;
}

// Mirrors fetchChapterJson above, but novels use a singular /chapter/ path and their API
// response is flat (no "data" envelope) — the parsed.data ?? parsed fallback handles both
export async function fetchNovelChapterJson(
  mangaId: string,
  chapterNumber: string,
): Promise<unknown> {
  const result = await authorizedFetch(`/api/novel-series/${mangaId}/chapter/${chapterNumber}`);
  if (!result) return undefined;

  const [response, data] = result;
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Asura Scans returned HTTP ${response.status} for the authenticated novel chapter endpoint`,
    );
  }

  const parsed = JSON.parse(Application.arrayBufferToUTF8String(data)) as {
    data?: unknown;
  };
  return parsed.data ?? parsed;
}

// Fully public — confirmed identical results with and without a token — so unlike
// fetchChapterJson/fetchNovelChapterJson this never goes through authorizedFetch
export async function fetchNovelSearch(url: string): Promise<unknown> {
  const [response, data] = await Application.scheduleRequest({ url, method: "GET" });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Asura Scans returned HTTP ${response.status} for the novel search API`);
  }
  return JSON.parse(Application.arrayBufferToUTF8String(data));
}
