# Sources from other repositories

This site has four repositories for each app version (the homepage has a
v9 / v8 tab for each version):

- `stable` (shown as SFW): English (and multi-language) sources for everyone or mature readers
- `languages` (shown as Others): sources in other languages (Indonesian, Spanish, French, …)
- `nsfw`: sources rated 18+, in any language
- `trackers`: trackers (AniList, MangaUpdates, MyAnimeList, …), which keep
  reading progress in sync and have no chapters of their own

Each source goes in one of them: trackers by what they do, the others by their
own content rating and language (`scripts/languages.mjs`).

`scripts/aggregate.mjs` brings in the sources of other public Paperback
repositories when they are built (on every push and once a day):

- each repository copies the published bundles made for its own app version,
  unchanged; trackers (AniList, MangaUpdates, …) get a small layer after
  their unchanged bundle (`scripts/tracker-history/`, made here: `layer.js` for
  0.9, `layer08.js` for 0.8) that adds an "Automatic updates" page to their
  settings: the time since Paperback last sent them what you read, and a
  history of what was sent. Their version gets two more digits so the app
  offers it (1.0.0-alpha.19 → 1.0.0-alpha.1901, 1.0.1 → 1.0.101).
- sources that exist for only one app version are also offered on the other:
  `scripts/crossport.mjs` puts the original bundle, unchanged, behind a small
  layer that provides the app it was written for (`scripts/crossport/v8on9.js`
  runs 0.8 sources on 0.9, `scripts/crossport/v9on8.js` runs 0.9 sources on
  0.8). These are marked "0.8 port" or "0.9 port" in the app.

A source counts as already present when its id or name matches one that is, or
it reads the same website; earlier repositories win. Left out of the ports:
novel sites on 0.8 (0.8 can't show text chapters), 0.9 sources that need a
hidden web page (`executeInWebView`, which 0.8 doesn't have), and trackers.
MyAnimeList on 0.9 is made in this repository instead (`src/MyAnimeList`),
adapted from Paperback's 0.8 MyAnimeList tracker (Paperback-iOS/extensions,
GPL-3.0).
Asura Scans is kept here too (`src/AsuraScans`): a copy of the source in
Nicartjay/PaperbackExt (MIT, `third-party/licenses/MIT-PaperbackExt.txt`), itself
converted from keiyoushi's, with only the type imports changed for this
repository's checks. It handles the Cloudflare check the site turned on in
November 2026, which Kodama's source answers with HTTP 403.

The lists, with each repository's license, are in
`scripts/aggregate.config.json`; the homepage credits each source and links to
its repository, license and source code.

## Paperback 0.9 repositories

| Repository                                                                                          | License |
| --------------------------------------------------------------------------------------------------- | ------- |
| [inkdex/extensions](https://github.com/inkdex/extensions)                                           | GPL-3.0 |
| [karrot0/KakarotExtension](https://github.com/karrot0/KakarotExtension)                             | MIT     |
| [Catta1997/Sinon-Paperback-Extensions](https://github.com/Catta1997/Sinon-Paperback-Extensions)     | GPL-3.0 |
| [kittycatgit/kitty-extensions-0.9](https://github.com/kittycatgit/kitty-extensions-0.9)             | GPL-3.0 |
| [itskodama/paperback-extensions](https://github.com/itskodama/paperback-extensions)                 | GPL-3.0 |
| [LucifersCircle/pirate.vodka-extensions](https://github.com/LucifersCircle/pirate.vodka-extensions) | GPL-3.0 |
| [feliivk/felii-extensions](https://github.com/feliivk/felii-extensions)                             | GPL-3.0 |
| [xdKinso/kinso-extensions-v0.8](https://github.com/xdKinso/kinso-extensions-v0.8)                   | GPL-3.0 |
| [Paperback-iOS/extensions-default](https://github.com/Paperback-iOS/extensions-default)             | GPL-3.0 |
| [TheNetsky/netskys-extensions](https://github.com/TheNetsky/netskys-extensions)                     | MIT     |
| [Elrulia/paperback-extension](https://github.com/Elrulia/paperback-extension)                       | GPL-3.0 |

## Paperback 0.8 repositories

| Repository                                                                                                          | License |
| ------------------------------------------------------------------------------------------------------------------- | ------- |
| [acepilot147/pb-extensions](https://github.com/acepilot147/pb-extensions)                                           | GPL-3.0 |
| [feliivk/felii-extensions](https://github.com/feliivk/felii-extensions)                                             | GPL-3.0 |
| [PoppingMangoSources/popmango-paperback-sources](https://github.com/PoppingMangoSources/popmango-paperback-sources) | GPL-3.0 |
| [timkuel/PaperBackExtension](https://github.com/timkuel/PaperBackExtension)                                         | MIT     |
| [HailXD/pb-extensions](https://github.com/HailXD/pb-extensions)                                                     | GPL-3.0 |
| [karrot0/kakarotextension0.8](https://github.com/karrot0/kakarotextension0.8)                                       | GPL-3.0 |
| [naufaljct48/nopools-ext](https://github.com/naufaljct48/nopools-ext)                                               | MIT     |
| [ryukajinokami/paperback-extensions](https://github.com/ryukajinokami/paperback-extensions)                         | MIT     |
| [g2asell2019/numby-extensions](https://github.com/g2asell2019/numby-extensions)                                     | GPL-3.0 |
| [gabrielcwt/gabe-extensions](https://github.com/gabrielcwt/gabe-extensions)                                         | GPL-3.0 |
| [TheNetsky/community-extensions](https://github.com/TheNetsky/community-extensions)                                 | GPL-3.0 |
| [ivanmatthew/ivans-paperback-extensions](https://github.com/ivanmatthew/ivans-paperback-extensions)                 | MIT     |
| [awwrch/extension](https://github.com/awwrch/extension)                                                             | GPL-3.0 |
| [Seyden/community-extensions](https://github.com/Seyden/community-extensions)                                       | GPL-3.0 |
| [Paperback-iOS/extensions-default](https://github.com/Paperback-iOS/extensions-default)                             | GPL-3.0 |
| [TheNetsky/extensions-generic-0.8](https://github.com/TheNetsky/extensions-generic-0.8)                             | MIT     |
| [TheNetsky/netskys-extensions](https://github.com/TheNetsky/netskys-extensions)                                     | MIT     |
| [CookieSylvia/cookies-extensions](https://github.com/CookieSylvia/cookies-extensions)                               | MIT     |
| [Seyden/extensions-generic-0.8](https://github.com/Seyden/extensions-generic-0.8)                                   | MIT     |
| [hoang3402/extensions-vn](https://github.com/hoang3402/extensions-vn)                                               | MIT     |
| [Paperback-iOS/extensions](https://github.com/Paperback-iOS/extensions)                                             | GPL-3.0 |

Not included, because they don't allow copying (no license, or "all rights
reserved"): nyzzik/extensions, TheVodraz/paperback-extensions,
michaelasper/paperback-corruptbytes (0.9); shadorig/real-extensions,
kittycatgit/kitty-extensions-0.8, benjamin5896/bens-paperback-extensions,
dutch25/VietSource (0.8). They can still be added to Paperback on their own.

Sites for a single series (ReadOnePiece, ReadBleach and the like, from
TheNetsky/extensions-generic-0.8) are left out on purpose: `leaveOut` in
`scripts/aggregate.config.json`.
So are clients for a server you run yourself (Komga, Kavita and the like).
Drake Scans is made in this repository (`src/DrakeScans`), since the site was
rebuilt; the older copies in inkdex and TheNetsky/extensions-generic-0.8 are
left out (`replacedByOwn`). The 0.8 repositories get this repository's own
sources ported, ahead of other 0.9 repositories' copies.

The 0.8 ports bundle [cheerio](https://github.com/cheeriojs/cheerio) 1.0.0-rc.12
(MIT), which the 0.8 app provided to its sources; the 0.9 ports bundle
[entities](https://github.com/fb55/entities) (BSD-2-Clause) and
[noble-hashes](https://github.com/paulmillr/noble-hashes) /
[noble-ciphers](https://github.com/paulmillr/noble-ciphers) (MIT) for what the
0.9 app provides.

License texts: `third-party/licenses/`.

## Source stats

The homepage's status dots, "Popular" tags, sort bar and "Recommended" come
from `scripts/stats.mjs`: once a day every source is opened the way the app
would (home page or a search, then one manga's chapters) and the results of
the last 14 days are kept. Website popularity is each site's rank in the
[Tranco list](https://tranco-list.eu) of the most visited websites.

What each source's website has (`scripts/site-info.mjs`), shown on hover or tap:
roughly how many titles, counted from the site's sitemap; when the site's
address was registered, from the public domain registration records
([RDAP](https://rdap.org)); and whether it mostly has manga, manhwa, manhua,
Western comics or novels, from a sample of its titles looked up on
[AniList](https://anilist.co). Paperback doesn't publish how many people use
each source, so popularity stays the website's Tranco rank.

Sources from other repositories that stop working (the site is gone, or they
fail every daily check for three days) are left out of the repositories until
a daily check finds them working again (`stoppedWorking` in `stats.json`).
