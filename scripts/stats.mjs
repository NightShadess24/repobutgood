// Source stats for the homepage, written to bundles/stats.json:
//
//   checks       whether each source still works, from a daily check (last 14
//                days): it opens the source the way the app would, finds manga
//                (home page, else a search) and lists one's chapters.
//                ok    found manga and chapters
//                cf    the site asked for its Cloudflare check (works in the
//                      app once you pass it)
//                fail  didn't work (why is kept)
//                skip  can't be checked outside the app (your own server,
//                      a hidden web page)
//   ranks        how popular each source's website is: its rank in the Tranco
//                list of the most visited websites (https://tranco-list.eu)
//   recommended  sources that worked in recent checks and whose site is popular
//   about        what each source's website has: roughly how many titles,
//                when its address was registered and whether it's mostly
//                manga, manhwa, manhua, Western comics or novels
//                (scripts/site-info.mjs; `sites` keeps it per website)
//
// Daily runs (`--check`, or STATS_CHECK=1) check every source and refresh the
// ranks; other builds carry the last stats over. Some sites block automated
// visitors, so a failed check doesn't always mean the source is broken.
//
// Usage: node scripts/stats.mjs [bundleFolder] [--check] [--previous file] [--ranks file] [--no-sites]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";

import { portToV9 } from "./crossport.mjs";
import {
  countTitles,
  isNovelSource,
  kindFromName,
  KIND_VERSION,
  kindOf,
  registeredDomain,
  registeredOn,
} from "./site-info.mjs";

const args = process.argv.slice(2);
const flag = (name) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : undefined;
};
const valueFlags = new Set(["--previous", "--ranks"]);
const folder =
  args.find((arg, i) => !arg.startsWith("--") && !valueFlags.has(args[i - 1])) ?? "bundles";
const runChecks = args.includes("--check") || process.env.STATS_CHECK === "1";

const KEEP_DAYS = 14;
const RECENT = 7;
const POPULAR_RANK = 50_000;
const today = new Date().toISOString().slice(0, 10);

function branchName() {
  if (process.env.BUILD_REF) return process.env.BUILD_REF;
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  try {
    return execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const versioning = JSON.parse(fs.readFileSync(path.join(folder, "versioning.json"), "utf8"));
let thirdParty = {};
try {
  thirdParty = JSON.parse(fs.readFileSync(path.join(folder, "third-party.json"), "utf8"));
} catch {
  thirdParty = {};
}
const hosts = thirdParty.hosts ?? {};

// ── The last stats (from the published site) ─────────────────────────────

async function previousStats() {
  const file = flag("--previous");
  if (file) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return {};
    }
  }
  const repository = process.env.GITHUB_REPOSITORY || "NightShadess24/repobutgood";
  const url = `https://raw.githubusercontent.com/${repository}/gh-pages/${branchName()}/stats.json`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    return response.ok ? await response.json() : {};
  } catch {
    return {};
  }
}

// ── Checking a source ────────────────────────────────────────────────────

const SERVER_CLIENTS = /^(komga|kavita|kavya|paperback)/i;
const STEP_SECONDS = 30;

function withTimeout(promise, seconds, what) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${what} took over ${seconds}s`)), seconds * 1000),
    ),
  ]);
}

async function loadExtension(id, entry) {
  const { ApplicationPolyfill } = await import("@paperback/runtime-polyfills");
  let file = path.join(folder, id, "index.js");
  let temp;
  // A 0.8 source (source.js; the 0.8 toolchain also leaves an unbundled
  // index.js next to it): checked through the same layer that runs it on 0.9.
  if (fs.existsSync(path.join(folder, id, "source.js"))) {
    temp = fs.mkdtempSync(path.join(os.tmpdir(), "stats-"));
    const port = await portToV9({ id, dir: path.join(folder, id), entry, outDir: temp });
    if (port.skipped) throw Object.assign(new Error(port.skipped), { skip: true });
    file = path.join(temp, id, "index.js");
  }
  const quiet = { log() {}, warn() {}, error() {}, info() {}, debug() {} };
  const context = vm.createContext({
    Application: ApplicationPolyfill(),
    console: quiet,
    TextDecoder,
    TextEncoder,
    atob,
    btoa,
    setTimeout,
    clearTimeout,
    URL,
    // The app gives sources Web Crypto too.
    crypto: globalThis.crypto,
  });
  const code = fs.readFileSync(file, "utf8");
  if (temp) fs.rmSync(temp, { recursive: true, force: true });
  return vm.runInContext(`${code}\n;source`, context, { timeout: 30_000 })[id];
}

// Why a request never got an answer (Node reports all of these as "fetch failed").
function networkProblem(error) {
  const cause = error?.cause ?? error;
  const code = String(cause?.code ?? cause?.cause?.code ?? "");
  const detail = String(cause?.message ?? "");
  if (/ENOTFOUND|EAI_AGAIN/.test(code) || /ENOTFOUND|getaddrinfo/.test(detail))
    return "the site's address doesn't exist any more";
  if (/CERT|SSL|TLS/i.test(code) || /certificate|ssl|tls/i.test(detail))
    return "the site's security certificate is broken";
  if (
    /ECONNREFUSED|ECONNRESET|UND_ERR_SOCKET|EPIPE/.test(code) ||
    /other side closed|refused|reset/i.test(detail)
  )
    return "the site refused the connection";
  if (/TIMEOUT|ETIMEDOUT/i.test(code) || /timeout|aborted/i.test(detail))
    return "the site didn't answer";
  return code ? `couldn't reach the site (${code})` : "couldn't reach the site";
}

function classify(error) {
  const message = String(error?.message ?? error);
  if (error?.skip) return { r: "skip", why: message };
  if (/fetch failed/i.test(message)) return { r: "fail", why: networkProblem(error) };
  if (error?.name === "TimeoutError" || /aborted due to timeout/i.test(message))
    return { r: "fail", why: "the site didn't answer" };
  if (/not implemented/i.test(message))
    return { r: "skip", why: "needs the app (hidden web page)" };
  if (
    error?.type === "cloudflareError" ||
    /cloudflare|just a moment|cf-chl|bypass/i.test(message)
  ) {
    return { r: "cf" };
  }
  return { r: "fail", why: message.split("\n")[0].slice(0, 140) };
}

// The pages each site was asked for during the checks, to see where a source
// opens a title ("/manga/<slug>") for scripts/site-info.mjs.
const pathsSeen = new Map();
const bareHost = (host) =>
  String(host ?? "")
    .toLowerCase()
    .replace(/^www\./, "");

function titlePathOf(host, mangaId) {
  const slug = String(mangaId ?? "")
    .split("/")
    .filter(Boolean)
    .pop();
  if (!slug || slug.length < 3) return undefined;
  for (const seen of [...(pathsSeen.get(bareHost(host)) ?? [])].reverse()) {
    const at = seen.lastIndexOf(`/${slug}`);
    if (at < 1 || !["", "/"].includes(seen.slice(at + 1 + slug.length))) continue;
    const prefix = seen.slice(0, at + 1);
    if (prefix.split("/").length <= 4) return prefix;
  }
  return undefined;
}

const titleOf = (item) => String(item?.title ?? item?.primaryTitle ?? "").trim();

async function check(id, entry, host) {
  const capabilities = Array.isArray(entry.capabilities)
    ? entry.capabilities
    : [entry.intents ?? 1].flat();
  const chapters = capabilities.some((c) => Number(c) & 1);
  if (!chapters) return { r: "skip", why: "not a manga source" };
  if (SERVER_CLIENTS.test(id)) return { r: "skip", why: "needs your own server" };
  // Titles seen on the way, for what the site mostly has (scripts/site-info.mjs)
  const sample = { titles: [], tags: {} };
  const note = (items) => {
    for (const item of items) {
      const title = titleOf(item);
      if (title && sample.titles.length < 12 && !sample.titles.includes(title))
        sample.titles.push(title);
    }
  };
  const withSample = (result) => (sample.titles.length ? { ...result, sample } : result);
  try {
    const ext = await withTimeout(loadExtension(id, entry), STEP_SECONDS, "loading");
    // Trackers and the like say they have chapters but don't.
    if (typeof ext.getMangaDetails !== "function" || typeof ext.getChapters !== "function")
      return { r: "skip", why: "not a manga source" };
    await withTimeout(Promise.resolve(ext.initialise?.()), STEP_SECONDS, "starting");
    let items = [];
    if (typeof ext.getDiscoverSections === "function") {
      try {
        const sections =
          (await withTimeout(ext.getDiscoverSections(), STEP_SECONDS, "home page")) ?? [];
        for (const section of sections.filter((s) => s.type !== 4).slice(0, 3)) {
          const page = await withTimeout(
            ext.getDiscoverSectionItems(section, undefined),
            STEP_SECONDS,
            "home section",
          );
          const found = (page?.items ?? []).filter((item) => item?.mangaId);
          note(found);
          if (!items.length) items = found;
          if (items.length && sample.titles.length >= 8) break;
        }
      } catch (error) {
        if (classify(error).r === "cf") throw error;
      }
    }
    if ((!items.length || sample.titles.length < 6) && typeof ext.getSearchResults === "function") {
      let sorting;
      try {
        sorting = (await ext.getSortingOptions?.({ title: "a" }))?.[0];
      } catch {
        sorting = undefined;
      }
      for (const title of ["a", "one"]) {
        try {
          const page = await withTimeout(
            ext.getSearchResults({ title }, undefined, sorting),
            STEP_SECONDS,
            "search",
          );
          const found = (page?.items ?? []).filter((item) => item?.mangaId);
          note(found);
          if (!items.length) items = found;
        } catch (error) {
          // Only a search that was needed counts against the source.
          if (!items.length) throw error;
        }
        if (items.length) break;
      }
    }
    if (!items.length) return { r: "fail", why: "found no manga" };
    for (const item of items.slice(0, 2)) {
      const manga = await withTimeout(
        ext.getMangaDetails(item.mangaId),
        STEP_SECONDS,
        "manga page",
      );
      sample.path ??= titlePathOf(host, item.mangaId);
      const tags = (manga?.mangaInfo?.tagGroups ?? []).flatMap((group) =>
        (group?.tags ?? []).map((tag) => String(tag?.title ?? "")),
      );
      if (tags.length && titleOf(item)) sample.tags[titleOf(item)] = tags.slice(0, 40);
      const list = await withTimeout(ext.getChapters(manga), STEP_SECONDS, "chapter list");
      if ((list ?? []).length) return withSample({ r: "ok" });
    }
    return withSample({ r: "fail", why: "found manga but no chapters" });
  } catch (error) {
    return withSample(classify(error));
  }
}

async function checkAll(sources) {
  const results = {};
  const queue = [...sources];
  // Real requests to real sites: a few at a time, a few per source.
  const realFetch = globalThis.fetch;
  globalThis.fetch = (url, init = {}) => {
    try {
      const href = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
      const parsed = new URL(href);
      const seen = pathsSeen.get(bareHost(parsed.hostname)) ?? [];
      seen.push(parsed.pathname);
      if (seen.length > 100) seen.shift();
      pathsSeen.set(bareHost(parsed.hostname), seen);
    } catch {
      // not a URL; fetch says so
    }
    return realFetch(url, { signal: AbortSignal.timeout(25_000), ...init });
  };
  process.on("unhandledRejection", () => {});
  const worker = async () => {
    for (let source = queue.shift(); source; source = queue.shift()) {
      const started = Date.now();
      results[source.id] = await withTimeout(
        check(source.id, source, hosts[source.id]),
        120,
        "the check",
      ).catch(classify);
      console.log(
        `[stats] ${source.id}: ${results[source.id].r}${results[source.id].why ? ` (${results[source.id].why})` : ""} ${Math.round((Date.now() - started) / 1000)}s`,
      );
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  globalThis.fetch = realFetch;
  return results;
}

// ── Website popularity (Tranco) ──────────────────────────────────────────

// The domains to look a host up by: itself, without www, and its last two
// (or three, for co.uk-style) labels.
function candidates(host) {
  const clean = String(host ?? "")
    .toLowerCase()
    .replace(/^www\./, "");
  if (!clean) return [];
  const labels = clean.split(".");
  const out = new Set([clean]);
  if (labels.length > 2) {
    const two = labels.slice(-2).join(".");
    out.add(/^(co|com|net|org|ac)\.[a-z]{2}$/.test(two) ? labels.slice(-3).join(".") : two);
  }
  return [...out];
}

async function trancoRanks(wanted) {
  const file = flag("--ranks");
  let text;
  if (file) {
    text = fs.readFileSync(file, "utf8");
  } else {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tranco-"));
    try {
      const response = await fetch("https://tranco-list.eu/top-1m.csv.zip", {
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      fs.writeFileSync(path.join(dir, "list.zip"), Buffer.from(await response.arrayBuffer()));
      text = execFileSync("unzip", ["-p", path.join(dir, "list.zip")], {
        maxBuffer: 1 << 28,
      }).toString("utf8");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  const ranks = new Map();
  for (const line of text.split("\n")) {
    const comma = line.indexOf(",");
    if (comma < 0) continue;
    const domain = line
      .slice(comma + 1)
      .trim()
      .toLowerCase();
    if (wanted.has(domain) && !ranks.has(domain)) ranks.set(domain, Number(line.slice(0, comma)));
  }
  return ranks;
}

// ── What each website has (scripts/site-info.mjs) ────────────────────────

// Kept per website, and shared between the repositories (most sites are in
// both the 0.9 and 0.8 ones): the newest of each wins.
const SITE_FIELDS = [
  ["titles", "titlesOn", ["path"]],
  ["since", "sinceOn", []],
  ["kind", "kindOn", ["kindV"]],
];
const BRANCHES = [
  "0.9/stable",
  "0.9/languages",
  "0.9/nsfw",
  "0.8/stable",
  "0.8/languages",
  "0.8/nsfw",
  "0.9/trackers",
  "0.8/trackers",
];

async function otherBranchesSites() {
  if (flag("--previous")) return [];
  const repository = process.env.GITHUB_REPOSITORY || "NightShadess24/repobutgood";
  return Promise.all(
    BRANCHES.filter((branch) => branch !== branchName()).map(async (branch) => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${repository}/gh-pages/${branch}/stats.json`,
          { signal: AbortSignal.timeout(30_000) },
        );
        return response.ok ? ((await response.json()).sites ?? {}) : {};
      } catch {
        return {};
      }
    }),
  );
}

function mergeSites(lists) {
  const merged = {};
  for (const list of lists) {
    for (const [host, info] of Object.entries(list ?? {})) {
      const into = (merged[host] ??= {});
      for (const [field, on, extra] of SITE_FIELDS) {
        if (!info?.[on] || (into[on] && into[on] >= info[on])) continue;
        into[field] = info[field] ?? null;
        into[on] = info[on];
        for (const name of extra) if (info[name] !== undefined) into[name] = info[name];
      }
    }
  }
  return merged;
}

const daysSince = (date) => (Date.parse(today) - Date.parse(date)) / 86_400_000;

async function pool(jobs, workers, deadline, run) {
  const queue = [...jobs];
  const worker = async () => {
    for (let job = queue.shift(); job !== undefined; job = queue.shift()) {
      if (Date.now() > deadline) return;
      await run(job);
    }
  };
  await Promise.all(Array.from({ length: workers }, worker));
}

// Looks up what's due: titles weekly, what it has monthly (when the check
// saw some titles), when the address was registered once.
async function lookUpSites(sites, samples) {
  const deadline = Date.now() + 20 * 60_000;
  const idsOf = new Map();
  for (const id of ids) {
    const host = bareHost(hosts[id]);
    if (host) idsOf.set(host, [...(idsOf.get(host) ?? []), id]);
  }
  const sampleOf = (host) =>
    (idsOf.get(host) ?? [])
      .map((id) => samples[id])
      .filter(Boolean)
      .sort((a, b) => b.titles.length - a.titles.length)[0];
  const pathOf = (host) =>
    (idsOf.get(host) ?? []).map((id) => samples[id]?.path).find(Boolean) ?? sites[host]?.path;
  const set = (host, values) => Object.assign((sites[host] ??= {}), values);
  const all = [...idsOf.keys()];
  const titleJobs = all.filter(
    (host) => !sites[host]?.titlesOn || daysSince(sites[host].titlesOn) >= 7,
  );
  const sinceJobs = all.filter((host) => {
    const site = sites[host];
    return !site?.sinceOn || (!site.since && daysSince(site.sinceOn) >= 30);
  });
  const kindJobs = all.filter((host) => {
    const site = sites[host];
    return (
      sampleOf(host) &&
      (!site?.kindOn ||
        site.kindV !== KIND_VERSION ||
        daysSince(site.kindOn) >= (site.kind ? 30 : 7))
    );
  });
  const started = Date.now();
  await Promise.all([
    pool(titleJobs, 4, deadline, async (host) => {
      const titles = await withTimeout(countTitles(host, pathOf(host)), 90, "sitemap").catch(
        () => null,
      );
      set(host, { titles, titlesOn: today, path: pathOf(host) });
    }),
    pool(sinceJobs, 1, deadline, async (host) => {
      const since = await registeredOn(registeredDomain(host));
      if (since !== undefined) set(host, { since, sinceOn: today });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    pool(kindJobs, 1, deadline, async (host) => {
      const kind = await kindOf(sampleOf(host)).catch(() => null);
      set(host, { kind, kindOn: today, kindV: KIND_VERSION });
    }),
  ]);
  console.log(
    `[stats] websites: ${titleJobs.length} title counts, ${sinceJobs.length} registration dates, ` +
      `${kindJobs.length} samples looked up in ${Math.round((Date.now() - started) / 1000)}s`,
  );
}

// ── Failed checks: is the site gone, or only turning the check away? ──────

const BOT_CHECK =
  /just a moment|cf-chl|challenge-platform|ddos-guard|checking your browser|captcha|attention required|are you a robot|bot verification|sucuri website firewall/i;
const PARKED =
  /domain (?:name )?(?:is|may be) for sale|buy this domain|this domain (?:is|has been) parked|parked (?:free|domain)|sedoparking|hugedomains|afternic|domain parking|account (?:has been )?suspended|this account has been suspended|welcome to nginx!|apache2 (?:ubuntu|debian) default page|default web site page|<title>\s*index of \//i;
const DEFINITE = /address doesn't exist|security certificate is broken/;

// One look at the site's home page, the way a browser would ask for it.
async function probeSite(host) {
  try {
    const response = await fetch(`https://${host}/`, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(20_000),
    });
    const text = (await response.text()).slice(0, 300_000);
    const server = `${response.headers.get("server") ?? ""} ${response.headers.get("cf-mitigated") ?? ""}`;
    if (
      BOT_CHECK.test(text) ||
      (/cloudflare|ddos-guard/i.test(server) && [403, 429, 503].includes(response.status))
    )
      return { site: "blocked" };
    if (response.status === 403 || response.status === 429) return { site: "blocked" };
    if (response.status === 404 || response.status === 410 || response.status >= 500)
      return { site: "gone", why: `the site's home page answers ${response.status}` };
    if (PARKED.test(text)) return { site: "gone", why: "the site's address is parked or for sale" };
    const landed = bareHost(new URL(response.url).hostname);
    if (registeredDomain(landed) !== registeredDomain(host))
      return { site: "moved", why: `the site moved to ${landed}` };
    return { site: "up" };
  } catch (error) {
    return { site: "unreachable", why: networkProblem(error) };
  }
}

// Today's failures: a site that turns automated visitors away counts like
// Cloudflare's check (it works in the app once you pass it); a site that's
// gone or moved says so.
async function probeFailures(checks) {
  const failed = Object.entries(checks)
    .map(([id, history]) => [id, history.at(-1)])
    .filter(
      ([id, entry]) =>
        entry?.d === today && entry.r === "fail" && hosts[id] && !DEFINITE.test(entry.why ?? ""),
    );
  const byHost = new Map();
  for (const [id, entry] of failed)
    byHost.set(bareHost(hosts[id]), [...(byHost.get(bareHost(hosts[id])) ?? []), entry]);
  await pool([...byHost.keys()], 6, Date.now() + 5 * 60_000, async (host) => {
    const found = await probeSite(host);
    for (const entry of byHost.get(host)) {
      if (found.site === "blocked") {
        entry.r = "cf";
        entry.why =
          "the site turned the check away (bot protection); works in the app once you pass it";
      } else if (found.site === "gone" || found.site === "moved") {
        entry.why = `${found.why} (${entry.why})`;
      }
      entry.site = found.site;
    }
  });
  console.log(`[stats] looked at ${byHost.size} sites of failed checks`);
}

// Third-party sources that stopped working: the last check failed and none
// of the last three worked. They're left out of the repository until a
// daily check finds them working again (they're still checked every day).
// Sources made here are never left out.
const CHECKER_FAULT = /source is not defined/;
function stoppedWorking(history) {
  const recent = (history ?? []).filter((entry) => !CHECKER_FAULT.test(entry.why ?? "")).slice(-3);
  return (
    recent.length > 0 &&
    recent.at(-1).r === "fail" &&
    !recent.some((entry) => entry.r === "ok" || entry.r === "cf")
  );
}

// ── Build stats.json ─────────────────────────────────────────────────────

const previous = await previousStats();
const ids = new Set(versioning.sources.map((source) => source.id));
const checks = {};
for (const [id, history] of Object.entries(previous.checks ?? {})) {
  if (ids.has(id)) checks[id] = history;
}
let ranks = Object.fromEntries(Object.entries(previous.ranks ?? {}).filter(([id]) => ids.has(id)));
let ranksUpdated = previous.ranksUpdated;
const sites = mergeSites([previous.sites, ...(await otherBranchesSites())]);

if (runChecks) {
  const results = await checkAll(versioning.sources);
  const samples = {};
  for (const [id, { sample, ...result }] of Object.entries(results)) {
    if (sample) samples[id] = sample;
    const history = (checks[id] ?? []).filter((entry) => entry.d !== today);
    history.push({ d: today, ...result });
    checks[id] = history.slice(-KEEP_DAYS);
  }
  await probeFailures(checks);
  if (!args.includes("--no-sites")) await lookUpSites(sites, samples);
  try {
    const wanted = new Set(Object.values(hosts).flatMap(candidates));
    const found = await trancoRanks(wanted);
    ranks = {};
    for (const [id, host] of Object.entries(hosts)) {
      if (!ids.has(id)) continue;
      const best = Math.min(...candidates(host).map((domain) => found.get(domain) ?? Infinity));
      if (Number.isFinite(best)) ranks[id] = best;
    }
    ranksUpdated = today;
  } catch (error) {
    console.warn(`[stats] couldn't get the Tranco list: ${error.message}`);
  }
}

// Worked recently (Cloudflare's check counts: the site is up and works in the
// app after it) and its website is popular.
const recommended = [];
for (const id of ids) {
  const recent = (checks[id] ?? []).slice(-RECENT).filter((entry) => entry.r !== "skip");
  if (!recent.length || recent.at(-1).r === "fail") continue;
  const worked = recent.filter((entry) => entry.r === "ok" || entry.r === "cf").length;
  if (worked / recent.length >= 0.85 && (ranks[id] ?? Infinity) <= POPULAR_RANK)
    recommended.push(id);
}

// For the page: what each source's website has.
const about = {};
const ownSites = {};
for (const source of versioning.sources) {
  const host = bareHost(hosts[source.id]);
  const site = sites[host] ?? {};
  if (sites[host]) ownSites[host] = site;
  const kind = isNovelSource(source, host)
    ? { novel: 1 }
    : (site.kind ?? kindFromName(source, host));
  const entry = {};
  if (kind) entry.kind = kind;
  if (site.titles) entry.titles = site.titles;
  if (site.since) entry.since = site.since;
  if (Object.keys(entry).length) about[source.id] = entry;
}

// Left out until they work again
const fromElsewhere = new Set(
  (thirdParty.upstreams ?? []).flatMap((upstream) => [
    ...(upstream.added ?? []),
    ...(upstream.ported ?? []),
  ]),
);
const leftOut = {};
for (const id of ids) {
  if (fromElsewhere.has(id) && stoppedWorking(checks[id])) {
    leftOut[id] = checks[id].at(-1).why ?? "stopped working";
  }
}
if (Object.keys(leftOut).length && !args.includes("--keep-all")) {
  versioning.sources = versioning.sources.filter((source) => !leftOut[source.id]);
  fs.writeFileSync(path.join(folder, "versioning.json"), JSON.stringify(versioning));
  for (const id of Object.keys(leftOut)) {
    fs.rmSync(path.join(folder, id), { recursive: true, force: true });
  }
  if (thirdParty.upstreams) {
    for (const upstream of thirdParty.upstreams) {
      upstream.added = (upstream.added ?? []).filter((id) => !leftOut[id]);
      upstream.ported = (upstream.ported ?? []).filter((id) => !leftOut[id]);
    }
    thirdParty.stoppedWorking = leftOut;
    fs.writeFileSync(path.join(folder, "third-party.json"), JSON.stringify(thirdParty));
  }
  console.log(
    `[stats] left out ${Object.keys(leftOut).length} sources that stopped working: ${Object.keys(leftOut).join(", ")}`,
  );
}

const stats = {
  updated: runChecks ? today : previous.updated,
  ranksUpdated,
  checks,
  ranks,
  recommended,
  about,
  sites: ownSites,
  stoppedWorking: leftOut,
};
fs.writeFileSync(path.join(folder, "stats.json"), JSON.stringify(stats));
const counted = Object.values(checks).map((history) => history.at(-1)?.r);
console.log(
  `[stats] ${runChecks ? "checked" : "carried over"}: ${counted.filter((r) => r === "ok").length} ok, ` +
    `${counted.filter((r) => r === "cf").length} Cloudflare, ${counted.filter((r) => r === "fail").length} failed, ` +
    `${counted.filter((r) => r === "skip").length} skipped; ${Object.keys(ranks).length} ranked; ${recommended.length} recommended`,
);
process.exit(0);
