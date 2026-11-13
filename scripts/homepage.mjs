// Replaces the toolchain's generated homepage (`bundles/index.html`) with a
// static page in the Noir look: dark, shop-style page — slim top bar, banner
// links with a gold accent, serif display headings, and the plain list of
// sources with their tags under a row of filter tabs. (The Classic styles
// below are no longer reachable: the page always opens in Noir.)
//
// The site publishes more than one repository (one per branch, see REPOS),
// for two app versions: tabs pick Paperback 0.9 ("v9") or 0.8 ("v8"), then a
// link per repository of that version. Hovering a link shows that
// repository's sources, clicking it keeps them shown. This branch's
// repository is built into the page, the others are read from their
// versioning.json (0.9 and 0.8 write it differently; both are read).
//
// The top bar switches between this page ("Aggregated") and the
// Repositories page ("Separate": repos-page/, published to /repos/, every
// repository the site gathers sources from, to add on its own). Both pages
// share their background and that switch (repos-page/site.css).
//
// Runs after `paperback-cli bundle`.
// Usage: node scripts/homepage.mjs [bundleFolder]

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// The repositories on this site, in the order their links are shown.
// `place`: top (the links under the version tabs), bottom (a quiet link at
// the end of the page) or secret (shown after tapping "Available Sources"
// five times in a row, or when that repository's own page is open).
const REPOS = [
  { ref: "0.9/stable", label: "SFW", version: "0.9", place: "top" },
  { ref: "0.9/nsfw", label: "NSFW", version: "0.9", place: "top" },
  { ref: "0.9/testversion", label: "Test Version", version: "0.9", place: "secret" },
  { ref: "0.9/languages", label: "Others", version: "0.9", place: "bottom" },
  { ref: "0.9/trackers", label: "Trackers", version: "0.9", place: "bottom" },
  { ref: "0.8/stable", label: "SFW", version: "0.8", place: "top" },
  { ref: "0.8/nsfw", label: "NSFW", version: "0.8", place: "top" },
  { ref: "0.8/languages", label: "Others", version: "0.8", place: "bottom" },
  { ref: "0.8/trackers", label: "Trackers", version: "0.8", place: "bottom" },
];
// The app versions, in the order their tabs are shown.
const VERSIONS = [
  { id: "0.9", label: "v9", title: "Paperback 0.9" },
  { id: "0.8", label: "v8", title: "Paperback 0.8" },
];

const folder = process.argv[2] ?? "bundles";
const versioning = JSON.parse(fs.readFileSync(path.join(folder, "versioning.json"), "utf8"));
const { name, description } = versioning.repository ?? {
  name: "Paperback Extensions",
  description: "A Paperback extensions repository",
};

function branchName() {
  // BUILD_REF: the branch a scheduled run builds (GITHUB_REF_NAME is then
  // always the default branch).
  if (process.env.BUILD_REF) return process.env.BUILD_REF;
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  try {
    return execSync("git branch --show-current", { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}
const current = REPOS.find((repo) => repo.ref === branchName()) ?? REPOS[0];

// Where the Bundle and Deploy workflow publishes the site on GitHub Pages
// (each repository lives under it at its branch name). The page also works
// it out from its own address when it is opened.
function deployedSiteRoot() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  if (!owner || !repo) return "";
  const host = `${owner.toLowerCase()}.github.io`;
  return repo.toLowerCase() === host ? `https://${host}/` : `https://${host}/${repo}/`;
}
const siteRoot = deployedSiteRoot();
const baseUrlOf = (ref) => (siteRoot ? siteRoot + ref : "");
const reposPageUrl = siteRoot ? `${siteRoot}repos/` : "../../repos/";

// The look shared with the Repositories page (repos-page/site.css), with its
// pictures inlined.
const sharedDir = path.join(import.meta.dirname, "..", "repos-page");
const siteCss = fs
  .readFileSync(path.join(sharedDir, "site.css"), "utf8")
  .replace(
    /url\("([\w-]+\.svg)"\)/g,
    (_, file) =>
      `url("data:image/svg+xml,${encodeURIComponent(fs.readFileSync(path.join(sharedDir, file), "utf8"))}")`,
  );

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Keeps `</script>` and friends from ending the inline script early.
const jsonForScript = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

const addRepoLink = (displayName, baseUrl) =>
  `paperback://addRepo?displayName=${encodeURIComponent(displayName)}&url=${encodeURIComponent(baseUrl)}`;

const RATING_TAGS = {
  MATURE: { label: "Mature", type: "warning" },
  ADULT: { label: "18+", type: "danger" },
};

// 0.9 entries have `description` and `badges` (colours), 0.8 ones `desc` and
// `tags` (a type: default, success, info, warning, danger).
function normalizeSource(source) {
  return {
    id: source.id,
    name: String(source.name ?? source.id).trim(),
    description: source.description ?? source.desc ?? "",
    version: source.version,
    contentRating: source.contentRating,
    badges:
      source.badges ??
      (source.tags ?? [])
        .filter((tag) => tag?.text)
        .map((tag) => ({ label: tag.text, type: tag.type === "default" ? undefined : tag.type })),
  };
}

// The language of a source not in English (third-party.json `languages`),
// shown as a tag so the Languages repositories can be filtered by it.
let languageNames;
try {
  languageNames = new Intl.DisplayNames(["en"], { type: "language" });
} catch {
  languageNames = undefined;
}
const languageName = (code) => {
  try {
    return languageNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

const LANGUAGE_TAG =
  /^(english|indonesia|indonesian|arabic|spanish|español|french|italian|portuguese|japanese|raw|vietnamese|korean|thai|turkish|german|russian|polish|chinese)\b/i;

function sourceTags(source) {
  const tags = (source.badges ?? []).map((badge) =>
    badge.backgroundColor
      ? {
          label: badge.label,
          style: `background-color:${badge.backgroundColor};border-color:${badge.backgroundColor};color:${badge.textColor}`,
        }
      : { label: badge.label, type: badge.type },
  );
  const rating = RATING_TAGS[String(source.contentRating).toUpperCase()];
  if (rating) tags.push({ label: rating.label, type: rating.type });
  // One tag per language, named the same way whoever wrote the source
  // ("Indonesia", "Indonesian", "Español", "French 🇫🇷" → one name).
  if (source.language) {
    const own = tags.filter((tag) => !LANGUAGE_TAG.test(tag.label));
    tags.length = 0;
    tags.push({ label: languageName(source.language), type: "info" }, ...own);
  }
  // A source's own "18+" tag and the rating's are the same tag.
  return tags.filter(
    (tag, i) =>
      tags.findIndex((other) => other.label.toLowerCase() === tag.label.toLowerCase()) === i,
  );
}

const tagHtml = (tag) =>
  `<span class="el-tag el-tag--dark el-tag--mini${tag.type ? ` el-tag--${tag.type}` : ""}"${
    tag.style ? ` style="${escapeHtml(tag.style)}"` : ""
  }>${escapeHtml(tag.label)}</span>`;

// Sources copied in from other repositories (scripts/aggregate.mjs) and where
// they came from, shown next to each source and in the credits.
let thirdParty = null;
try {
  thirdParty = JSON.parse(fs.readFileSync(path.join(folder, "third-party.json"), "utf8"));
} catch {
  thirdParty = null;
}
// Upstreams can list a repository more than once (one per folder); credit
// it once.
function creditList(upstreams) {
  const byRepo = new Map();
  for (const upstream of upstreams ?? []) {
    const count = (upstream.added?.length ?? 0) + (upstream.ported?.length ?? 0);
    if (!count) continue;
    const key = `${upstream.url}|${upstream.appVersion ?? ""}`;
    const credit = byRepo.get(key) ?? {
      label: upstream.label,
      url: upstream.url,
      sourceCode: upstream.sourceCode,
      license: upstream.license,
      licenseFile: upstream.licenseFile,
      commit: String(upstream.commit ?? "").slice(0, 7),
      count: 0,
      ported: Boolean(upstream.ported?.length),
      appVersion: upstream.appVersion,
    };
    credit.count += count;
    byRepo.set(key, credit);
  }
  return [...byRepo.values()];
}
const credits = creditList(thirdParty?.upstreams);
const originOf = new Map(
  (thirdParty?.upstreams ?? []).flatMap((upstream) => [
    ...(upstream.added ?? []).map((id) => [id, upstream.label]),
    ...(upstream.ported ?? []).map((id) => [id, upstream.label]),
  ]),
);

const CREDITS_NOTE =
  "Copied from those public repositories when this one is built; their authors keep the credit. Sources marked “0.8 port” or “0.9 port” are the original code, unchanged, with a small layer that lets it run on the other app version.";

function creditsHtml(list) {
  if (!list.length) return "";
  return `<h3>Included from other repositories</h3>
<ul>
${list
  .map(
    (c) =>
      `<li><a href="${escapeHtml(c.url)}">${escapeHtml(c.label)}</a> · ${c.count} source${c.count === 1 ? "" : "s"}${
        c.ported ? ` (${escapeHtml(c.appVersion)}, ported)` : ""
      } · ${escapeHtml(c.license)} (<a href="licenses/${escapeHtml(c.licenseFile)}">license</a>, <a href="${escapeHtml(
        c.sourceCode,
      )}">source code</a>)${c.commit ? ` · ${escapeHtml(c.commit)}` : ""}</li>`,
  )
  .join("\n")}
</ul>
<p>${CREDITS_NOTE}</p>`;
}

function sourceItem(source) {
  const tags = sourceTags(source);
  const filters = tags.map((tag) => tag.label).join("|");
  return `<li class="source" data-tags="${escapeHtml(filters)}" title="${escapeHtml(
    source.description ?? "",
  )}">${escapeHtml(source.name)}<span class="version">${escapeHtml(source.version ?? "")}</span>${
    originOf.has(source.id)
      ? `<span class="origin">${escapeHtml(originOf.get(source.id))}</span>`
      : ""
  }${tags.map(tagHtml).join("")}</li>`;
}

const sortByName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));
// Works-check results and website popularity (scripts/stats.mjs).
let stats = null;
try {
  stats = JSON.parse(fs.readFileSync(path.join(folder, "stats.json"), "utf8"));
} catch {
  stats = null;
}
// Only what the page shows: the last week of checks.
const pageStats = stats && {
  updated: stats.updated,
  checks: Object.fromEntries(
    Object.entries(stats.checks ?? {}).map(([id, list]) => [id, list.slice(-7)]),
  ),
  ranks: stats.ranks ?? {},
  recommended: stats.recommended ?? [],
  about: stats.about ?? {},
};

const languagesById = thirdParty?.languages ?? {};
const sources = sortByName(
  versioning.sources.map((source) => ({
    ...normalizeSource(source),
    language: languagesById[source.id],
  })),
);
const filterLabels = [
  ...new Set(sources.flatMap((source) => sourceTags(source).map((t) => t.label))),
];
const footerText = (repoName, count, buildTime) =>
  `${repoName} · ${count} source${count === 1 ? "" : "s"} · built ${String(buildTime ?? "").slice(0, 10)}`;

// What the page needs to redraw this repository after showing another one.
const embedded = {
  name,
  description,
  buildTime: versioning.buildTime,
  sources: sources.map(({ id, name, description, version, contentRating, badges, language }) => ({
    id,
    name,
    description,
    version,
    contentRating,
    badges,
    language,
    origin: originOf.get(id),
  })),
  credits,
  stats: pageStats,
};

const baseUrl = baseUrlOf(current.ref);

// One group of links per app version, so separators and rounded ends only
// count the links of the version shown.
const repoLink = (repo) =>
  `<a class="repo-link" href="${escapeHtml(siteRoot ? `${siteRoot}${repo.ref}/` : `../../${repo.ref}/`)}" data-ref="${escapeHtml(repo.ref)}" data-version="${escapeHtml(repo.version)}" data-place="${escapeHtml(repo.place)}"${
    repo === current ? ' aria-current="true"' : ""
  }${repo.place === "secret" && repo !== current ? " hidden" : ""}>${escapeHtml(repo.label)}</a>`;
const linkGroups = (wanted) =>
  VERSIONS.map(
    (version) =>
      `<span class="repo-group" data-version="${escapeHtml(version.id)}"${
        version.id === current.version ? "" : " hidden"
      }>${REPOS.filter((repo) => repo.version === version.id && wanted(repo.place))
        .map(repoLink)
        .join("")}</span>`,
  ).join("");
const repoLinks = linkGroups((place) => place !== "bottom");
const otherLinks = linkGroups((place) => place === "bottom");

const versionTabs = VERSIONS.map(
  (version) =>
    `<button class="version-tab" type="button" data-version="${escapeHtml(version.id)}" title="${escapeHtml(
      version.title,
    )}" aria-pressed="${version.id === current.version}">${escapeHtml(version.label)}</button>`,
).join("");

const html = `<!DOCTYPE html>
<html lang="en" data-theme="noir">
<head>
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<meta name="referrer" content="no-referrer">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="https://paperback.moe/pb-logo.svg">
<title>${escapeHtml(name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
<style>
/* ---------- Shared ---------- */
* { box-sizing: border-box; }
.title { font-weight: 700; margin-bottom: 8px; }
.icon { max-height: 8rem; }
.noir-only { display: none; }
.classic-only { display: revert; }
ul { margin-top: 0; }
.source { overflow-wrap: anywhere; }
.version { margin-left: 8px; font-size: 12px; opacity: .55; font-variant-numeric: tabular-nums; }
.status { margin: 0; padding-left: 40px; }
.origin { margin-left: 8px; font-size: 12px; opacity: .55; }
.origin::before { content: "· "; }
.credits { font-size: 13px; line-height: 1.6; margin-top: 2rem; }
.credits h3 { font-size: 14px; margin: 0 0 .4rem; }
.credits ul { padding-left: 20px; margin: 0 0 .4rem; }
.credits p { margin: 0; opacity: .7; }

/* Repository links: hover shows that repository's sources, click keeps them */
.repo-switch { display: flex; justify-content: center; flex-wrap: wrap; }
.repo-link { cursor: pointer; white-space: nowrap; }
.repo-group { display: contents; }
.repo-group[hidden] { display: none !important; }

/* "Others": a quiet link at the end of the page */
.others-switch { display: flex; justify-content: center; margin-top: 40px; }
.js-available { -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; }

/* App version tabs (v9 / v8) */
.version-switch { display: flex; justify-content: center; gap: 0; }
.version-tab { cursor: pointer; font: inherit; }

/* Tags, after Element's tag component (https://element.eleme.io/#/en-US/component/tag) */
.el-tag {
  display: inline-block;
  height: 32px;
  margin-left: 4px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  white-space: nowrap;
}
.el-tag--dark { background-color: #409eff; border-color: #409eff; color: #fff; }
.el-tag--mini { height: 20px; padding: 0 5px; line-height: 19px; }
.el-tag--dark.el-tag--success { background-color: #67c23a; border-color: #67c23a; color: #fff; }
.el-tag--dark.el-tag--info { background-color: #909399; border-color: #909399; color: #fff; }
.el-tag--dark.el-tag--danger { background-color: #f56c6c; border-color: #f56c6c; color: #fff; }
.el-tag--dark.el-tag--warning { background-color: #e6a23c; border-color: #e6a23c; color: #fff; }

/* ---------- Classic (Paperback 0.8 repository page) ---------- */
[data-theme="classic"] body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #fff;
  margin: 8px;
  padding: 3.6rem 2rem 1.5rem;
  text-align: center;
}
[data-theme="classic"] h1 { font-size: 1.7rem; margin: 1rem auto; }
[data-theme="classic"] .pageDescription { max-width: 35rem; font-size: 1.3rem; line-height: 1.3; color: #6a8bad; margin: 1rem auto; }
[data-theme="classic"] .addToPaperbackButton {
  display: inline-block;
  width: 10rem;
  line-height: 1.7;
  margin: .25rem;
  padding: .4rem;
  color: #fff;
  background-color: #2e84bf;
  border-bottom: 1px solid #2977ac;
  border-radius: 4px;
  transition: background-color .1s ease;
}
[data-theme="classic"] .addToPaperbackButton:hover { background-color: #3992cf; text-decoration: none; }
[data-theme="classic"] .content { margin: auto; max-width: 920px; text-align: left; }
[data-theme="classic"] blockquote {
  font-size: .9rem;
  color: #999;
  border-left: .2rem solid #dfe2e5;
  margin: 1rem 0;
  padding: .25rem 0 .25rem 1rem;
  line-height: 1.6;
}
[data-theme="classic"] blockquote p { margin-top: 2px; margin-bottom: 2px; }
[data-theme="classic"] a { font-weight: 500; text-decoration: none; color: #2196f3; }
[data-theme="classic"] a:hover { text-decoration: underline; }
[data-theme="classic"] .baseUrl { background-color: #f0f4f8; border-radius: .4rem; padding: .1rem .1rem; overflow-wrap: anywhere; }
[data-theme="classic"] .baseUrl p { margin-left: 16px; }
[data-theme="classic"] #listDiv { line-height: 1.5; }
[data-theme="classic"] .sources { padding-left: 40px; }
[data-theme="classic"] .repo-switch { gap: 0; margin: 0 auto 1rem; }
[data-theme="classic"] .repo-link {
  padding: .35rem 1rem;
  border: 1px solid #2e84bf;
  color: #2e84bf;
  font-size: .95rem;
}
[data-theme="classic"] .repo-switch { row-gap: 6px; }
[data-theme="classic"] .repo-link + .repo-link { border-left: 0; }
[data-theme="classic"] .repo-link.row-start { border-left: 1px solid #2e84bf; border-radius: 4px 0 0 4px; }
[data-theme="classic"] .repo-link.row-end { border-radius: 0 4px 4px 0; }
[data-theme="classic"] .repo-link.row-start.row-end { border-radius: 4px; }
[data-theme="classic"] .others-switch .repo-link { border: 0; border-radius: 0; padding: 2px 6px; background: none; color: #6a8bad; font-size: .85rem; }
[data-theme="classic"] .others-switch .repo-link[aria-current="true"] { color: #2e84bf; text-decoration: underline; }
[data-theme="classic"] .repo-link:hover { text-decoration: none; background: #ecf5ff; }
[data-theme="classic"] .repo-link[aria-current="true"] { background: #2e84bf; color: #fff; }
[data-theme="classic"] .version-switch { margin: 0 auto .6rem; }
[data-theme="classic"] .version-tab {
  padding: .3rem 1.4rem;
  border: 1px solid #6a8bad;
  background: #fff;
  color: #6a8bad;
  font-size: .95rem;
  font-weight: 600;
}
[data-theme="classic"] .version-tab:first-child { border-radius: 999px 0 0 999px; }
[data-theme="classic"] .version-tab:last-child { border-radius: 0 999px 999px 0; }
[data-theme="classic"] .version-tab + .version-tab { border-left: 0; }
[data-theme="classic"] .version-tab[aria-pressed="true"] { background: #6a8bad; color: #fff; }

/* ---------- Noir (dark shop style) ---------- */
[data-theme="noir"] {
  --bg: #1b1b1d;
  --surface: #232326;
  --line: #e9e9e9;
  --text: #f2f2f2;
  --muted: #a3a3aa;
  --gold: #c9a45c;
  --blue: #5d9dfe;
  color-scheme: dark;
}
[data-theme="noir"] body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", Roboto, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
}
[data-theme="noir"] .noir-only { display: revert; }
[data-theme="noir"] .classic-only,
[data-theme="noir"] [hidden] { display: none !important; }
[data-theme="noir"] a { color: var(--blue); text-decoration: none; }

[data-theme="noir"] .topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 52px;
  line-height: 52px;
  text-align: center;
  background: var(--bg);
  padding: 0 16px;
  border-bottom: 1px solid #2c2c30;
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
[data-theme="noir"] .version-switch { margin: 22px auto 0; width: max-content; border: 1px solid #4a4a50; border-radius: 999px; padding: 3px; }
[data-theme="noir"] .version-tab {
  min-width: 64px;
  padding: 5px 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: .08em;
  transition: background-color .2s ease, color .2s ease;
}
[data-theme="noir"] .version-tab:hover { color: var(--text); }
[data-theme="noir"] .version-tab[aria-pressed="true"] { background: var(--gold); color: #1b1b1d; }
[data-theme="noir"] .repo-switch { gap: 0; margin: 14px 0 6px; }
[data-theme="noir"] .repo-link {
  padding: 4px 22px 8px;
  color: var(--muted);
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  background-image: linear-gradient(var(--gold), var(--gold));
  background-size: 0 2px;
  background-position: 50% 100%;
  background-repeat: no-repeat;
  transition: background-size .25s ease, color .2s ease;
}
[data-theme="noir"] .repo-link + .repo-link { border-left: 1px solid #55555a; }
[data-theme="noir"] .repo-link.row-start { border-left-color: transparent; }
[data-theme="noir"] .repo-switch { row-gap: 4px; }
[data-theme="noir"] .others-switch .repo-link {
  padding: 2px 8px 4px;
  border: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: none;
  color: #6b6b72;
  background-size: 0 1px;
}
[data-theme="noir"] .others-switch .repo-link:hover,
[data-theme="noir"] .others-switch .repo-link[aria-current="true"] { color: var(--gold); background-size: 100% 1px; }
[data-theme="noir"] .repo-link:hover,
[data-theme="noir"] .repo-link:focus-visible { color: var(--text); background-size: 60% 2px; outline: none; }
[data-theme="noir"] .repo-link[aria-current="true"] { color: var(--gold); background-size: 60% 2px; }
[data-theme="noir"] .tabs {
  display: flex;
  justify-content: center;
  justify-content: safe center;
  gap: 26px;
  overflow-x: auto;
  scrollbar-width: none;
  max-width: 920px;
  margin: 0 auto;
  padding: 0 0 26px;
}
[data-theme="noir"] .tabs::-webkit-scrollbar { display: none; }
[data-theme="noir"] .tab {
  flex: none;
  background: none;
  border: 0;
  padding: 2px 0;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background-image: linear-gradient(var(--text), var(--text));
  background-size: 0 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size .25s ease;
}
[data-theme="noir"] .tab:hover,
[data-theme="noir"] .tab[aria-pressed="true"] { background-size: 100% 1px; }
[data-theme="noir"] .tab--brand { font-family: "Cormorant Garamond", "Times New Roman", serif; font-size: 17px; font-weight: 600; }

[data-theme="noir"] main { max-width: 1100px; margin: 0 auto; padding: 8px 16px 48px; }
[data-theme="noir"] .banner {
  display: flex;
  align-items: center;
  gap: 22px;
  margin: 14px 0;
  padding: 22px 22px;
  background: #0d0d0e;
  border-top: 3px solid var(--line);
  color: var(--gold);
  text-decoration: none;
}
[data-theme="noir"] .banner__label {
  flex: none;
  width: 140px;
  padding-right: 22px;
  border-right: 1px solid #55555a;
  color: var(--text);
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.1;
}
[data-theme="noir"] .banner__text { flex: 1; font-size: clamp(17px, 3.4vw, 28px); font-weight: 700; letter-spacing: .08em; }
[data-theme="noir"] .banner__chevron { flex: none; font-size: 28px; font-weight: 300; }
[data-theme="noir"] .banner:hover .banner__chevron { transform: translateX(3px); transition: transform .15s ease; }

[data-theme="noir"] .hero { text-align: center; padding: 56px 0 8px; }
[data-theme="noir"] .hero h1 {
  margin: 0;
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: clamp(34px, 7vw, 56px);
  font-weight: 600;
  line-height: 1.05;
}
[data-theme="noir"] .hero p { margin: 14px auto 0; max-width: 34rem; color: var(--muted); line-height: 1.6; }
[data-theme="noir"] .baseUrlBar {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 640px;
  margin: 26px auto 0;
  padding: 8px 8px 8px 14px;
  background: #fefefe;
  border: 1px solid #ddd;
  border-radius: 4px;
}
[data-theme="noir"] .baseUrlBar code { flex: 1; color: #555; font-size: 13px; overflow-wrap: anywhere; text-align: left; }
[data-theme="noir"] .copyButton {
  flex: none;
  border: 0;
  border-radius: 3px;
  padding: 6px 12px;
  background: var(--bg);
  color: var(--text);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
[data-theme="noir"] .section-title {
  margin: 64px 0 26px;
  text-align: center;
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: clamp(30px, 6vw, 48px);
  font-weight: 600;
  letter-spacing: .06em;
  line-height: 1.1;
  color: #e6e6e6;
}
[data-theme="noir"] #listDiv { max-width: 920px; margin: 0 auto; }
[data-theme="noir"] .sources { margin: 0; padding-left: 40px; line-height: 1.5; font-size: 16px; }
[data-theme="noir"] .sources.has-stats { list-style: none; padding-left: 8px; }
.health { display: inline-block; width: 9px; height: 9px; margin-right: 8px; border-radius: 50%; background: #6b6b72; vertical-align: 1px; }
.health--ok { background: #67c23a; }
.health--cf { background: #e6a23c; }
.health--fail { background: #f56c6c; }
.worked { margin-left: 6px; font-size: 12px; opacity: .6; font-variant-numeric: tabular-nums; }
.facts { margin-left: 8px; font-size: 12px; opacity: .6; font-variant-numeric: tabular-nums; }
.facts::before { content: "· "; }
.fact { white-space: nowrap; }
/* What a source has: shows on hover (mouse) or tap; a hover one lets the
   mouse through to the next source. */
.sources .source { position: relative; cursor: pointer; border-radius: 4px; }
.sources .source:focus-visible { outline: 1px solid var(--gold, #c9a45c); outline-offset: 2px; }
.about {
  position: absolute;
  left: 0;
  top: calc(100% + 4px);
  z-index: 20;
  width: min(460px, calc(100vw - 32px));
  padding: 12px 14px;
  background: #26262a;
  border: 1px solid #45454b;
  border-radius: 6px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .5);
  color: #f2f2f2;
  font-size: 13px;
  line-height: 1.5;
  cursor: auto;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity .12s, visibility 0s linear .12s;
}
.source.open > .about { visibility: visible; opacity: 1; pointer-events: auto; transition: opacity .12s; }
@media (hover: hover) and (pointer: fine) {
  .source:hover > .about { visibility: visible; opacity: 1; transition: opacity .12s .35s, visibility 0s .35s; }
}
.about__kind { font-size: 15px; font-weight: 600; color: #c9a45c; }
.about__kind--unknown { color: #a3a3aa; font-weight: 500; font-size: 13px; }
.about__desc { margin-top: 2px; color: #a3a3aa; }
.about ul { margin: 8px 0 0; padding-left: 18px; }
.about li { margin: 2px 0; }
.el-tag.tag--recommended { background-color: #c9a45c; border-color: #c9a45c; color: #1b1b1d; font-weight: 700; }
.el-tag.tag--popular { background-color: #3a3a40; border-color: #3a3a40; color: #f2f2f2; }
.stats-note { margin: 26px 0 0; font-size: 13px; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 20px; margin: 0; padding: 0; list-style: none; color: #c9c9cf; }
.legend li { display: flex; align-items: center; }
.legend-note { margin: 10px 0 0; font-size: 12px; opacity: .55; }
/* v9 / v8: the gold pill flows to the other side like liquid (a gooey
   filter merges the pill and its droplets) */
[data-theme="noir"] .version-switch { position: relative; isolation: isolate; }
.version-goo { position: absolute; inset: 0; z-index: -1; pointer-events: none; filter: url(#goo); }
.version-blob { position: absolute; top: 3px; bottom: 3px; left: 0; width: 0; border-radius: 999px; background: var(--gold, #c9a45c); transform-origin: center; }
.version-drop { position: absolute; top: 50%; left: 0; width: 20px; height: 20px; margin-top: -10px; border-radius: 50%; background: var(--gold, #c9a45c); opacity: 0; }
[data-theme="noir"] .version-switch.has-blob .version-tab[aria-pressed="true"] { background: transparent; }
[data-theme="noir"] .version-switch.has-blob .version-tab { transition: color .25s ease .12s; }
[data-theme="noir"] .sortbar { display: flex; justify-content: center; flex-wrap: wrap; align-items: center; gap: 6px; margin: -10px auto 24px; max-width: 920px; }
[data-theme="noir"] .sortbar__label { color: var(--muted); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; margin-right: 4px; }
[data-theme="noir"] .sortbar button {
  padding: 4px 12px;
  border: 1px solid #4a4a50;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
[data-theme="noir"] .sortbar button:hover { color: var(--text); border-color: var(--text); }
[data-theme="noir"] .sortbar button[aria-pressed="true"] { background: var(--gold); border-color: var(--gold); color: #1b1b1d; font-weight: 600; }
[data-theme="noir"] .sortbar .sort-reset { border-color: transparent; text-decoration: underline; text-underline-offset: 3px; }
[data-theme="noir"] .sortbar .sort-reset:disabled { opacity: .35; cursor: default; text-decoration: none; }
[data-theme="noir"] .sortbar .sort-reset:disabled:hover { color: var(--muted); border-color: transparent; }
[data-theme="noir"] .empty,
[data-theme="noir"] .status { color: var(--muted); }
[data-theme="noir"] .credits { max-width: 920px; margin: 48px auto 0; color: var(--muted); }
[data-theme="noir"] .credits h3 { color: var(--text); font-family: "Cormorant Garamond", "Times New Roman", serif; font-size: 20px; font-weight: 600; letter-spacing: .04em; }
[data-theme="noir"] footer { padding: 28px 16px; border-top: 1px solid #2c2c30; color: var(--muted); font-size: 12px; text-align: center; }

@media (max-width: 560px) {
  [data-theme="noir"] .sortbar__label { display: none; }
  [data-theme="noir"] .sortbar button { padding: 4px 10px; }
  [data-theme="noir"] .banner { gap: 14px; padding: 18px 14px; }
  [data-theme="noir"] .banner__label { width: 92px; padding-right: 14px; font-size: 15px; }
  [data-theme="noir"] .repo-link { padding: 4px 10px 8px; font-size: 16px; letter-spacing: .05em; }
  [data-theme="classic"] body { padding: 3.6rem 1rem 1.5rem; }
}
</style>
<style>
${siteCss}
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></svg>

<!-- Noir: top bar, banners, filter tabs above the sources -->
<div class="topbar noir-only"><nav class="mode-switch" aria-label="View"><a href="./" aria-current="page">Aggregated</a><a class="js-separate" href="${escapeHtml(reposPageUrl)}">Separate</a></nav></div>

<main>
<!-- Classic: header -->
<header class="classic-only">
<img class="icon" src="https://paperback.moe/icons/logo-alt.svg" alt="Repository logo" onerror="this.onerror=null;this.src='https://paperback.moe/pb-logo.svg'">
<h1 class="js-repo-name">${escapeHtml(name)}</h1>
<p class="pageDescription">A Paperback extensions repository</p>
</header>

<!-- Both: the app version, then one link per repository of that version -->
<nav class="version-switch" aria-label="Paperback version">${versionTabs}</nav>
<nav class="repo-switch" aria-label="Repositories">${repoLinks}</nav>

<header class="classic-only">
<a class="addToPaperbackButton js-add-repo" href="${escapeHtml(addRepoLink(name, baseUrl))}">Add to Paperback</a>
</header>

<div class="noir-only">
<a class="banner js-add-repo" href="${escapeHtml(addRepoLink(name, baseUrl))}"><span class="banner__label">Paperback</span><span class="banner__text">Add this repository</span><span class="banner__chevron">›</span></a><section class="hero">
<h1 class="js-repo-name">${escapeHtml(name)}</h1>
<div class="baseUrlBar"><code class="js-base-url">${escapeHtml(baseUrl)}</code><button class="copyButton" type="button">Copy URL</button></div>
</section>
<h2 class="section-title js-available">AVAILABLE<br>SOURCES</h2>
<nav class="tabs" aria-label="Filter sources">
<button class="tab tab--brand" type="button" data-filter="" aria-pressed="true">All Sources</button>
${filterLabels.map((label) => `<button class="tab" type="button" data-filter="${escapeHtml(label)}" aria-pressed="false">${escapeHtml(label)}</button>`).join("\n")}
</nav>
<nav class="sortbar" aria-label="Sort sources"${pageStats ? "" : " hidden"}><span class="sortbar__label">Sort</span><button type="button" data-sort="name" aria-pressed="true">A–Z</button><button type="button" data-sort="popular" aria-pressed="false">Popular</button><button type="button" data-sort="stable" aria-pressed="false">Stable</button><button type="button" data-sort="recommended" aria-pressed="false">Recommended</button><button type="button" data-sort="titles" aria-pressed="false">Most titles</button><button type="button" data-sort="newest" aria-pressed="false">Newest</button><button type="button" class="sort-reset" title="Back to A–Z" disabled>↺ Reset</button></nav>
</div>

<div class="content">
<div class="classic-only">
<blockquote>
<p><span>On a Paperback installed device, press </span><a class="js-add-repo" href="${escapeHtml(addRepoLink(name, baseUrl))}">Add to Paperback</a><span> or use the base URL to add this repository to the app.</span></p>
</blockquote>
<div class="baseUrl">
<p class="title">Base URL:</p>
<p class="js-base-url">${escapeHtml(baseUrl)}</p>
</div>
<p class="title js-available">Available Sources:</p>
</div>

<!-- Both: the sources -->
<div id="listDiv">
<ul class="sources">
${sources.map(sourceItem).join("\n")}
</ul>
<p class="status" hidden></p>
<p class="empty noir-only" hidden>No sources match this filter.</p>
<div class="stats-note"${pageStats ? "" : " hidden"}>
<ul class="legend">
<li><span class="health health--ok"></span>Works</li>
<li><span class="health health--cf"></span>Works after a quick check in the app</li>
<li><span class="health health--fail"></span>Not working right now</li>
<li><span class="health"></span>Not checked</li>
</ul>
<p class="legend-note">Checked daily. Tap a source for details. Popularity: <a href="https://tranco-list.eu">Tranco</a> · types: <a href="https://anilist.co">AniList</a></p>
</div>
</div>
<section class="credits js-credits"${credits.length ? "" : " hidden"}>${creditsHtml(credits)}</section>
<nav class="others-switch" aria-label="Other repositories">${otherLinks}</nav>
</div>
</main>
<footer class="noir-only js-footer">${escapeHtml(footerText(name, sources.length, versioning.buildTime))}</footer>

<script>
(function () {
  var REPOS = ${jsonForScript(REPOS)};
  var CREDITS_NOTE = ${jsonForScript(CREDITS_NOTE)};
  var LANGUAGE_TAG = new RegExp(${jsonForScript(LANGUAGE_TAG.source)}, "i");
  var CURRENT = ${jsonForScript(current.ref)};
  var BUILD_SITE_ROOT = ${jsonForScript(siteRoot)};
  var RATING_TAGS = ${jsonForScript(RATING_TAGS)};
  var data = {};
  data[CURRENT] = ${jsonForScript(embedded)};

  // Each repository lives at <site root><branch>, e.g. …/repobutgood/0.9/stable
  function siteRoot() {
    var at = location.pathname.indexOf("/" + CURRENT);
    if (/^https?:$/.test(location.protocol) && at !== -1) {
      return location.origin + location.pathname.slice(0, at + 1);
    }
    return BUILD_SITE_ROOT;
  }
  function baseUrlOf(ref) {
    var site = siteRoot();
    return site ? site + ref : "";
  }
  function addRepoLink(displayName, ref) {
    return "paperback://addRepo?displayName=" + encodeURIComponent(displayName) + "&url=" + encodeURIComponent(baseUrlOf(ref));
  }

  var list = document.querySelector(".sources");
  var tabs = document.querySelector(".tabs");
  var empty = document.querySelector(".empty");
  var status = document.querySelector(".status");
  var links = Array.prototype.slice.call(document.querySelectorAll(".repo-link"));
  var selected = CURRENT;
  var shown = CURRENT;
  var loading = {};

  links.forEach(function (link) {
    if (baseUrlOf(link.dataset.ref)) link.href = baseUrlOf(link.dataset.ref) + "/";
  });
  function repoOf(ref) {
    return REPOS.filter(function (r) { return r.ref === ref; })[0];
  }
  function labelOf(ref) {
    var repo = repoOf(ref);
    return repo ? repo.label + " (" + repo.version + ")" : ref;
  }

  // 0.9 entries have description/badges, 0.8 ones desc/tags.
  function normalize(s) {
    return {
      id: s.id,
      name: String(s.name || s.id).trim(),
      description: s.description || s.desc || "",
      version: s.version,
      contentRating: s.contentRating,
      badges: s.badges || (s.tags || []).filter(function (t) { return t && t.text; }).map(function (t) {
        return { label: t.text, type: t.type === "default" ? undefined : t.type };
      }),
    };
  }
  function creditList(upstreams) {
    var byRepo = {};
    var order = [];
    (upstreams || []).forEach(function (u) {
      var count = (u.added || []).length + (u.ported || []).length;
      if (!count) return;
      var key = u.url + "|" + (u.appVersion || "");
      if (!byRepo[key]) {
        byRepo[key] = { label: u.label, url: u.url, sourceCode: u.sourceCode, license: u.license, licenseFile: u.licenseFile, commit: String(u.commit || "").slice(0, 7), count: 0, ported: !!(u.ported && u.ported.length), appVersion: u.appVersion };
        order.push(key);
      }
      byRepo[key].count += count;
    });
    return order.map(function (key) { return byRepo[key]; });
  }

  function load(ref) {
    if (data[ref] || loading[ref]) return;
    loading[ref] = true;
    var getJson = function (file, optional) {
      return fetch(baseUrlOf(ref) + "/" + file, { cache: "no-cache" }).then(function (response) {
        if (!response.ok) {
          if (optional) return null;
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      }, function (error) {
        if (optional) return null;
        throw error;
      });
    };
    Promise.all([getJson("versioning.json", false), getJson("third-party.json", true), getJson("stats.json", true)])
      .then(function (both) {
        var versioning = both[0];
        var upstreams = (both[1] && both[1].upstreams) || [];
        var origins = {};
        upstreams.forEach(function (u) {
          (u.added || []).concat(u.ported || []).forEach(function (id) { origins[id] = u.label; });
        });
        var repository = versioning.repository || { name: labelOf(ref), description: "" };
        var languages = (both[1] && both[1].languages) || {};
        data[ref] = {
          name: repository.name,
          description: repository.description,
          buildTime: versioning.buildTime,
          sources: versioning.sources
            .map(function (s) { return Object.assign(normalize(s), { origin: origins[s.id], language: languages[s.id] }); })
            .sort(function (a, b) { return a.name.localeCompare(b.name); }),
          credits: creditList(upstreams),
          stats: both[2] || null,
        };
      })
      .catch(function () {
        data[ref] = { missing: true };
      })
      .then(function () {
        loading[ref] = false;
        if (shown === ref) show(ref);
      });
  }

  function tagsOf(source) {
    var tags = (source.badges || []).map(function (badge) {
      if (!badge.backgroundColor) return { label: badge.label, type: badge.type };
      return {
        label: badge.label,
        style: "background-color:" + badge.backgroundColor + ";border-color:" + badge.backgroundColor + ";color:" + badge.textColor,
      };
    });
    var rating = RATING_TAGS[String(source.contentRating).toUpperCase()];
    if (rating) tags.push(rating);
    if (source.language) {
      var name = source.language;
      try { name = new Intl.DisplayNames(["en"], { type: "language" }).of(source.language) || name; } catch (e) {}
      tags = [{ label: name, type: "info" }].concat(tags.filter(function (tag) { return !LANGUAGE_TAG.test(tag.label); }));
    }
    return tags.filter(function (tag, i) {
      return tags.findIndex(function (other) { return other.label.toLowerCase() === tag.label.toLowerCase(); }) === i;
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (node) { node.textContent = text; });
  }

  function renderTabs(labels) {
    tabs.textContent = "";
    var all = el("button", "tab tab--brand", "All Sources");
    all.type = "button";
    all.dataset.filter = "";
    all.setAttribute("aria-pressed", "true");
    tabs.appendChild(all);
    labels.forEach(function (label) {
      var tab = el("button", "tab", label);
      tab.type = "button";
      tab.dataset.filter = label;
      tab.setAttribute("aria-pressed", "false");
      tabs.appendChild(tab);
    });
  }

  var creditsBox = document.querySelector(".js-credits");
  function renderCredits(ref, list) {
    creditsBox.textContent = "";
    creditsBox.hidden = !list || !list.length;
    if (creditsBox.hidden) return;
    creditsBox.appendChild(el("h3", "", "Included from other repositories"));
    var ul = el("ul");
    list.forEach(function (c) {
      var li = el("li");
      var link = el("a", "", c.label);
      link.href = c.url;
      li.appendChild(link);
      li.appendChild(document.createTextNode(" · " + c.count + (c.count === 1 ? " source" : " sources") + (c.ported ? " (" + c.appVersion + ", ported)" : "") + " · " + c.license + " ("));
      var lic = el("a", "", "license");
      lic.href = baseUrlOf(ref) + "/licenses/" + c.licenseFile;
      li.appendChild(lic);
      li.appendChild(document.createTextNode(", "));
      var code = el("a", "", "source code");
      code.href = c.sourceCode;
      li.appendChild(code);
      li.appendChild(document.createTextNode(")" + (c.commit ? " · " + c.commit : "")));
      ul.appendChild(li);
    });
    creditsBox.appendChild(ul);
    creditsBox.appendChild(el("p", "", CREDITS_NOTE));
  }

  // What the stats say about a source: its last check, the checks it passed
  // in the last week, its website's rank and whether it's recommended.
  var POPULAR = [[10000, "Very popular"], [100000, "Popular"]];
  function statsOf(stats, id) {
    var checks = ((stats && stats.checks && stats.checks[id]) || []).filter(function (c) { return c.r !== "skip"; });
    var all = (stats && stats.checks && stats.checks[id]) || [];
    var last = all[all.length - 1];
    var worked = checks.filter(function (c) { return c.r === "ok" || c.r === "cf"; }).length;
    var rank = stats && stats.ranks ? stats.ranks[id] : undefined;
    var tier = POPULAR.filter(function (p) { return rank && rank <= p[0]; })[0];
    return {
      last: last,
      worked: worked,
      checked: checks.length,
      rank: rank,
      tier: tier ? tier[1] : "",
      recommended: !!(stats && (stats.recommended || []).indexOf(id) !== -1),
      about: (stats && stats.about && stats.about[id]) || {},
    };
  }

  // What a source's website has (scripts/site-info.mjs)
  var KIND_NAME = { manga: "manga", manhwa: "manhwa", manhua: "manhua", comic: "Western comics", novel: "novels" };
  var KIND_NOTE = { manga: "Japanese comics", manhwa: "Korean comics", manhua: "Chinese comics" };
  function listOf(words) {
    return words.length < 2 ? words.join("") : words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
  }
  function kindSummary(kind) {
    var kinds = Object.keys(kind || {}).filter(function (k) { return KIND_NAME[k] && kind[k] > 0; });
    if (!kinds.length) return "";
    var total = kinds.reduce(function (sum, k) { return sum + kind[k]; }, 0);
    kinds.sort(function (a, b) { return kind[b] - kind[a]; });
    var top = kinds[0];
    if (kind[top] / total >= 0.7) {
      if (top === "novel") return "Novels (text, not comics)";
      if (top === "comic") return "Mostly Western comics";
      return "Mostly " + top + " (" + KIND_NOTE[top] + ")";
    }
    var main = kinds.filter(function (k) { return kind[k] / total >= 0.2; });
    var text = listOf(main.map(function (k) { return KIND_NAME[k]; })) + (main.length < kinds.length ? ", and some others" : "");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  function shortNumber(n) {
    if (n < 1000) return String(n);
    if (n < 10000) return (n / 1000).toFixed(1).replace(/\\.0$/, "") + "k";
    if (n < 1000000) return Math.round(n / 1000) + "k";
    return (n / 1000000).toFixed(1).replace(/\\.0$/, "") + "M";
  }
  function ageOf(since) {
    var start = Date.parse(since);
    if (!start) return null;
    var months = Math.floor((Date.now() - start) / (30.44 * 86400000));
    if (months < 1) return { short: "new", long: "less than a month ago" };
    if (months < 12) return { short: months + " mo old", long: months + (months === 1 ? " month ago" : " months ago") };
    var years = Math.floor(months / 12);
    return { short: years + (years === 1 ? " yr old" : " yrs old"), long: years + (years === 1 ? " year ago" : " years ago") };
  }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function aboutBox(source, info, health) {
    var about = info.about;
    var box = el("div", "about");
    box.setAttribute("role", "note");
    var summary = kindSummary(about.kind);
    if (health) box.appendChild(el("div", "about__kind" + (summary ? "" : " about__kind--unknown"), summary || "What it has isn't known yet (its site couldn't be sampled)."));
    else box.appendChild(el("div", "about__kind", source.name));
    if (source.description) box.appendChild(el("div", "about__desc", source.description));
    var facts = el("ul");
    if (about.titles) facts.appendChild(el("li", "", "About " + about.titles.toLocaleString("en") + " titles (from the site's sitemap)"));
    var age = about.since && ageOf(about.since);
    if (age) {
      var date = new Date(about.since);
      facts.appendChild(el("li", "", "Site address registered " + MONTHS[date.getUTCMonth()] + " " + date.getUTCFullYear() + " (" + age.long + ")"));
    }
    if (info.rank) facts.appendChild(el("li", "", "#" + info.rank.toLocaleString("en") + " most visited website in the world"));
    if (source.version) facts.appendChild(el("li", "", "Version " + source.version));
    if (health) facts.appendChild(el("li", "", health));
    if (facts.childNodes.length) box.appendChild(facts);
    return box;
  }
  function closeAbout(except) {
    list.querySelectorAll(".source.open").forEach(function (item) {
      if (item !== except) {
        item.classList.remove("open");
        item.setAttribute("aria-expanded", "false");
      }
    });
  }
  list.addEventListener("click", function (event) {
    var item = event.target.closest(".source");
    if (!item || !item.querySelector(".about") || event.target.closest(".about")) return;
    closeAbout(item);
    var open = item.classList.toggle("open");
    item.setAttribute("aria-expanded", String(open));
  });
  list.addEventListener("keydown", function (event) {
    if (event.key === "Escape") return closeAbout(null);
    if (event.key !== "Enter" && event.key !== " ") return;
    var item = event.target.closest(".source");
    if (!item || event.target !== item) return;
    event.preventDefault();
    item.click();
  });
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".sources")) closeAbout(null);
  });
  function healthTitle(info) {
    if (!info.last) return "Not checked yet";
    var when = info.last.d ? " (" + info.last.d + ")" : "";
    if (info.last.r === "skip") return "Not checked: " + (info.last.why || "can't be checked outside the app");
    var summary = info.checked ? "Worked in " + info.worked + " of its last " + info.checked + " daily checks. " : "";
    if (info.last.r === "ok") return summary + "Last check worked" + when;
    if (info.last.r === "cf") return summary + "Last check: the site asked for Cloudflare's check" + when + ". It works in the app once you pass it.";
    return summary + "Last check failed" + when + ": " + (info.last.why || "unknown error");
  }

  function renderSources(sources, stats) {
    list.textContent = "";
    var labels = [];
    var firstLabels = [];
    sources.forEach(function (source) {
      var tags = tagsOf(source);
      var info = statsOf(stats, source.id);
      var item = el("li", "source");
      var dot = el("span", "health" + (info.last ? " health--" + info.last.r : ""));
      if (stats) item.appendChild(dot);
      item.appendChild(document.createTextNode(source.name));
      var extra = [];
      if (info.recommended) extra.push({ label: "★ Recommended", cls: "tag--recommended" });
      if (info.tier) extra.push({ label: info.tier, cls: "tag--popular" });
      item.dataset.tags = extra.concat(tags).map(function (t) { return t.label; }).join("|");
      item.dataset.name = source.name.toLowerCase();
      item.dataset.rank = info.rank || "";
      item.dataset.score = info.checked ? String(info.worked / info.checked + info.checked / 1000) : "";
      item.dataset.recommended = info.recommended ? "1" : "";
      item.dataset.titles = info.about.titles || "";
      item.dataset.since = info.about.since || "";
      // The numbers: titles, the site's age and its rank
      var facts = [];
      if (info.about.titles) facts.push(shortNumber(info.about.titles) + " titles");
      var age = info.about.since && ageOf(info.about.since);
      if (age) facts.push(age.short);
      if (info.rank) facts.push("#" + shortNumber(info.rank) + " site");
      if (facts.length) {
        var factsBox = el("span", "facts");
        facts.forEach(function (fact, i) {
          if (i) factsBox.appendChild(document.createTextNode(" · "));
          factsBox.appendChild(el("span", "fact", fact));
        });
        item.appendChild(factsBox);
      }
      if (source.origin) item.appendChild(el("span", "origin", source.origin));
      extra.forEach(function (tag) {
        item.appendChild(el("span", "el-tag el-tag--dark el-tag--mini " + tag.cls, tag.label));
        if (firstLabels.indexOf(tag.label) === -1) firstLabels.push(tag.label);
      });
      tags.forEach(function (tag) {
        var span = el("span", "el-tag el-tag--dark el-tag--mini" + (tag.type ? " el-tag--" + tag.type : ""), tag.label);
        if (tag.style) span.setAttribute("style", tag.style);
        item.appendChild(span);
        if (labels.indexOf(tag.label) === -1) labels.push(tag.label);
      });
      // Version and checks are in here, with what the site has
      item.appendChild(aboutBox(source, info, stats ? healthTitle(info) : ""));
      item.tabIndex = 0;
      item.setAttribute("aria-expanded", "false");
      list.appendChild(item);
    });
    var order = ["★ Recommended", "Very popular", "Popular"];
    firstLabels.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    renderTabs(firstLabels.concat(labels));
    list.classList.toggle("has-stats", !!stats);
    document.querySelector(".stats-note").hidden = !stats;
    document.querySelector(".sortbar").hidden = !stats;
    empty.hidden = true;
    applySort();
  }

  // Sort bar (remembered per browser). Tapping a sort again flips it
  // (Newest ⇄ Oldest); a third tap turns it off. Several sorts together
  // rank each source on each and put the best overall first. A–Z is the
  // order when nothing else is on (tap it again for Z–A); tapping it while
  // others are on goes back to A–Z.
  var SORTS = {
    popular: { label: ["Popular", "Least popular"], value: function (d) { return d.rank ? -Number(d.rank) : null; } },
    stable: { label: ["Stable", "Least stable"], value: function (d) { return d.score ? Number(d.score) : null; } },
    recommended: { label: ["Recommended", "Not recommended"], value: function (d) { return d.recommended ? 1 : 0; } },
    titles: { label: ["Most titles", "Fewest titles"], value: function (d) { return d.titles ? Number(d.titles) : null; } },
    newest: { label: ["Newest", "Oldest"], value: function (d) { return d.since ? Date.parse(d.since) : null; } },
  };
  var sortState = { reverseName: false, on: [] };
  try {
    var savedSort = JSON.parse(localStorage.getItem("repo-sort-2") || "null");
    if (savedSort && Array.isArray(savedSort.on)) {
      sortState.reverseName = !!savedSort.reverseName;
      sortState.on = savedSort.on.filter(function (s) { return s && SORTS[s.key]; });
    }
  } catch (e) {}
  var sortButtons = Array.prototype.slice.call(document.querySelectorAll(".sortbar button[data-sort]"));
  var sortReset = document.querySelector(".sort-reset");
  function activeSort(key) {
    return sortState.on.filter(function (s) { return s.key === key; })[0];
  }
  function updateSortButtons() {
    if (sortReset) sortReset.disabled = !sortState.on.length && !sortState.reverseName;
    sortButtons.forEach(function (button) {
      var key = button.dataset.sort;
      if (key === "name") {
        button.textContent = sortState.reverseName ? "Z–A" : "A–Z";
        button.setAttribute("aria-pressed", String(!sortState.on.length));
        return;
      }
      var active = activeSort(key);
      button.textContent = SORTS[key].label[active && active.flipped ? 1 : 0];
      button.setAttribute("aria-pressed", String(!!active));
      button.title = active ? (active.flipped ? "Tap to turn this sort off" : "Tap for the opposite order") : "Tap to sort by this; pick several to combine them";
    });
  }
  // Each sort ranks the sources from 0 (best) to 1 (worst); sources it
  // knows nothing about come after all of those.
  var MISSING = 1.25;
  function ranksFor(sort, items) {
    var known = items
      .map(function (item, i) { return { i: i, v: SORTS[sort.key].value(item.dataset) }; })
      .filter(function (entry) { return entry.v !== null && !isNaN(entry.v); });
    known.sort(function (a, b) { return sort.flipped ? a.v - b.v : b.v - a.v; });
    var ranks = items.map(function () { return MISSING; });
    var n = known.length;
    for (var start = 0; start < n; ) {
      var stop = start;
      while (stop + 1 < n && known[stop + 1].v === known[start].v) stop++;
      var place = n > 1 ? (start + stop) / 2 / (n - 1) : 0;
      for (var k = start; k <= stop; k++) ranks[known[k].i] = place;
      start = stop + 1;
    }
    return ranks;
  }
  function applySort() {
    updateSortButtons();
    var items = Array.prototype.slice.call(list.querySelectorAll(".source"));
    var perSort = sortState.on.map(function (sort) { return ranksFor(sort, items); });
    var byName = function (a, b) {
      var order = a.item.dataset.name < b.item.dataset.name ? -1 : a.item.dataset.name > b.item.dataset.name ? 1 : 0;
      return sortState.reverseName && !perSort.length ? -order : order;
    };
    items
      .map(function (item, i) {
        var total = 0;
        perSort.forEach(function (ranks) { total += ranks[i]; });
        return { item: item, score: perSort.length ? total / perSort.length : 0 };
      })
      .sort(function (a, b) { return a.score - b.score || byName(a, b); })
      .forEach(function (entry) { list.appendChild(entry.item); });
  }
  sortButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.dataset.sort;
      if (key === "name") {
        if (sortState.on.length) sortState = { reverseName: false, on: [] };
        else sortState.reverseName = !sortState.reverseName;
      } else {
        var active = activeSort(key);
        if (!active) sortState.on.push({ key: key, flipped: false });
        else if (!active.flipped) active.flipped = true;
        else sortState.on = sortState.on.filter(function (s) { return s !== active; });
      }
      try { localStorage.setItem("repo-sort-2", JSON.stringify(sortState)); } catch (e) {}
      applySort();
    });
  });
  if (sortReset) {
    sortReset.addEventListener("click", function () {
      sortState = { reverseName: false, on: [] };
      try { localStorage.setItem("repo-sort-2", JSON.stringify(sortState)); } catch (e) {}
      applySort();
    });
  }

  function show(ref) {
    shown = ref;
    links.forEach(function (link) {
      if (link.dataset.ref === selected) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    var repo = data[ref];
    if (!repo || repo.missing) {
      list.textContent = "";
      renderTabs([]);
      empty.hidden = true;
      status.hidden = false;
      status.textContent = repo ? "This repository isn't published yet." : "Loading sources…";
      setText(".js-repo-name", labelOf(ref));
      setText(".js-repo-description", "");
      renderCredits(ref, []);
      setText(".js-base-url", baseUrlOf(ref));
      if (!repo) load(ref);
      return;
    }
    status.hidden = true;
    setText(".js-repo-name", repo.name);
    setText(".js-repo-description", repo.description);
    setText(".js-base-url", baseUrlOf(ref));
    var count = repo.sources.length;
    setText(".js-footer", repo.name + " · " + count + (count === 1 ? " source" : " sources") + " · built " + String(repo.buildTime || "").slice(0, 10));
    document.querySelectorAll(".js-add-repo").forEach(function (a) { a.href = addRepoLink(repo.name, ref); });
    if (ref === selected) document.title = repo.name;
    renderSources(repo.sources, repo.stats);
    renderCredits(ref, repo.credits);
  }

  // With a mouse, hovering a link shows that repository and leaving goes back
  // to the chosen one. A click or tap chooses it. Touch gets no hover preview:
  // on iPhone the page changing under a tap cancels the tap, so "Add this
  // repository" would flip back to SFW instead of opening Paperback.
  var nav = document.querySelector(".repo-switch");
  var topLinks = links.filter(function (link) { return !!link.closest(".repo-switch"); });
  var secretLinks = links.filter(function (link) { return link.dataset.place === "secret"; });
  var revealed = false;
  var versionTabs = Array.prototype.slice.call(document.querySelectorAll(".version-tab"));
  // Links that start or end a row (they wrap on narrow screens): no
  // separator before the first of a row; Classic rounds each row's ends.
  function markRows() {
    var shown = topLinks.filter(function (link) { return !link.parentNode.hidden && !link.hidden; });
    for (var pass = 0; pass < 2; pass++) {
      shown.forEach(function (link, i) {
        var before = shown[i - 1];
        var after = shown[i + 1];
        link.classList.toggle("row-start", !before || before.offsetTop !== link.offsetTop);
        link.classList.toggle("row-end", !after || after.offsetTop !== link.offsetTop);
      });
    }
  }
  window.addEventListener("resize", markRows);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(markRows);
  // The gold pill behind the active version tab; switching splashes it
  // across (stretch, droplets, a little overshoot) unless reduced motion.
  var versionSwitch = document.querySelector(".version-switch");
  var goo = el("span", "version-goo");
  var blob = el("span", "version-blob");
  var drops = [0, 1, 2].map(function () { var drop = el("span", "version-drop"); goo.appendChild(drop); return drop; });
  goo.insertBefore(blob, goo.firstChild);
  versionSwitch.insertBefore(goo, versionSwitch.firstChild);
  versionSwitch.classList.add("has-blob");
  function activeVersionTab() {
    return versionTabs.filter(function (tab) { return tab.getAttribute("aria-pressed") === "true"; })[0];
  }
  function placeBlob() {
    var tab = activeVersionTab();
    if (!tab) return;
    blob.style.left = tab.offsetLeft + "px";
    blob.style.width = tab.offsetWidth + "px";
  }
  function splash(from, to) {
    placeBlob();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!from || from === to || reduce || !blob.animate) return;
    var a = { left: from.offsetLeft, width: from.offsetWidth };
    var b = { left: to.offsetLeft, width: to.offsetWidth };
    var dir = b.left > a.left ? 1 : -1;
    var reachLeft = dir > 0 ? a.left : b.left + b.width * 0.55;
    var reachRight = dir > 0 ? b.left + b.width * 0.45 : a.left + a.width;
    blob.animate([
      { left: a.left + "px", width: a.width + "px", transform: "scaleY(1)" },
      { left: reachLeft + "px", width: (reachRight - reachLeft) + "px", transform: "scaleY(.78)", offset: 0.35 },
      { left: (b.left - (dir < 0 ? 0 : 7)) + "px", width: (b.width + 7) + "px", transform: "scaleY(1.1)", offset: 0.72 },
      { left: b.left + "px", width: b.width + "px", transform: "scaleY(1)" },
    ], { duration: 680, easing: "cubic-bezier(.3,.7,.25,1)" });
    drops.forEach(function (drop, i) {
      var start = a.left + a.width / 2 - 10;
      var end = b.left + b.width / 2 - 10 + dir * (4 + i * 6);
      var middle = (start + end) / 2 + dir * i * 6;
      drop.animate([
        { transform: "translate(" + start + "px, 0) scale(.9)", opacity: 1 },
        { transform: "translate(" + middle + "px, " + (-9 - i * 6) + "px) scale(" + (1.05 - i * 0.18) + ")", opacity: 1, offset: 0.5 },
        { transform: "translate(" + end + "px, 1px) scale(.5)", opacity: 0 },
      ], { duration: 520 + i * 110, delay: 60 + i * 55, easing: "cubic-bezier(.45,0,.2,1)" });
    });
  }
  window.addEventListener("resize", placeBlob);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeBlob);
  function showVersion(version) {
    var before = activeVersionTab();
    versionTabs.forEach(function (tab) { tab.setAttribute("aria-pressed", String(tab.dataset.version === version)); });
    splash(before, activeVersionTab());
    document.querySelectorAll(".repo-group").forEach(function (group) { group.hidden = group.dataset.version !== version; });
    markRows();
    // "Separate" opens the Repositories page on the same app version.
    document.querySelectorAll(".js-separate").forEach(function (link) {
      link.href = link.href.split("#")[0] + (version === "0.8" ? "#v8" : "#v9");
    });
  }
  // The repository a version tab opens: the last one chosen there, else its first.
  function repoFor(version) {
    var remembered = null;
    try { remembered = sessionStorage.getItem("repo-choice-" + version); } catch (e) {}
    return REPOS.filter(function (r) { return r.version === version && r.ref === remembered && (r.place !== "secret" || revealed); })[0] ||
      REPOS.filter(function (r) { return r.version === version && r.place === "top"; })[0];
  }
  function choose(ref) {
    selected = ref;
    var repo = repoOf(ref);
    try {
      sessionStorage.setItem("repo-choice", ref);
      if (repo) sessionStorage.setItem("repo-choice-" + repo.version, ref);
    } catch (e) {}
    if (repo) showVersion(repo.version);
    show(ref);
  }
  versionTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var version = tab.dataset.version;
      if (repoOf(selected) && repoOf(selected).version === version) return;
      var target = repoFor(version);
      if (target) choose(target.ref);
    });
  });
  topLinks.forEach(function (link) {
    link.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse" && shown !== link.dataset.ref) show(link.dataset.ref);
    });
  });
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      choose(link.dataset.ref);
      if (link.dataset.place === "bottom") window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Test Version: tapping "Available Sources" five times in a row shows it.
  function reveal() {
    revealed = true;
    secretLinks.forEach(function (link) { link.hidden = false; });
    try { sessionStorage.setItem("show-test", "1"); } catch (e) {}
    markRows();
  }
  var taps = 0;
  var lastTap = 0;
  document.querySelectorAll(".js-available").forEach(function (title) {
    title.addEventListener("click", function () {
      var now = Date.now();
      taps = now - lastTap < 1500 ? taps + 1 : 1;
      lastTap = now;
      if (taps < 5 || !secretLinks.length) return;
      taps = 0;
      reveal();
      choose(secretLinks[0].dataset.ref);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  try {
    if (sessionStorage.getItem("show-test") === "1" || (repoOf(CURRENT) || {}).place === "secret") reveal();
  } catch (e) {}
  nav.addEventListener("pointerleave", function (event) {
    if (event.pointerType === "mouse" && shown !== selected) show(selected);
  });

  // Filter tabs (Noir)
  function showAll() {
    list.querySelectorAll(".source").forEach(function (item) { item.hidden = false; });
    empty.hidden = true;
  }
  tabs.addEventListener("click", function (event) {
    var tab = event.target.closest(".tab");
    if (!tab) return;
    var filter = tab.dataset.filter;
    tabs.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-pressed", String(t === tab)); });
    var count = 0;
    list.querySelectorAll(".source").forEach(function (item) {
      var match = !filter || item.dataset.tags.split("|").indexOf(filter) !== -1;
      item.hidden = !match;
      if (match) count++;
    });
    empty.hidden = count > 0;
  });

  var copy = document.querySelector(".copyButton");
  copy.addEventListener("click", function () {
    var done = function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy URL"; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(baseUrlOf(shown)).then(done, function () {});
  });

  // Keep the repository chosen in this tab, e.g. when Safari reloads the page
  // on coming back from Paperback.
  try {
    var saved = sessionStorage.getItem("repo-choice");
    if (REPOS.some(function (repo) { return repo.ref === saved && (repo.place !== "secret" || revealed); })) selected = saved;
  } catch (e) {}
  // Coming from the Repositories page: #v8 / #v9 opens that app version.
  var wanted = { "#v9": "0.9", "#v8": "0.8" }[location.hash];
  if (wanted) {
    if ((repoOf(selected) || {}).version !== wanted && repoFor(wanted)) selected = repoFor(wanted).ref;
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
  }
  choose(selected);
  REPOS.forEach(function (repo) { if (repo.ref !== CURRENT) load(repo.ref); });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(folder, "index.html"), html);
console.log(
  `Wrote ${path.join(folder, "index.html")} (${sources.length} sources, ${current.label})`,
);
