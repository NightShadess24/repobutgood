/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2026 NightShadess24 */
/* Adapted from the Paperback 0.8 MyAnimeList tracker (Paperback-iOS/extensions, GPL-3.0) */

import { ContentRating, SourceIntents, type ExtensionInfo } from "@paperback/types";

export default {
  name: "MyAnimeList",
  description: "Keeps your MyAnimeList manga list in sync as you read.",
  version: "1.0.4",
  icon: "icon.png",
  language: "en",
  contentRating: ContentRating.EVERYONE,
  // The same kinds as Paperback's own trackers (AniList, MangaUpdates):
  // progress, settings, search, and a Discover page.
  capabilities: [
    SourceIntents.DISCOVER_SECTION_PROVIDING,
    SourceIntents.MANGA_PROGRESS_PROVIDING,
    SourceIntents.SETTINGS_FORM_PROVIDING,
    SourceIntents.SEARCH_RESULT_PROVIDING,
  ],
  badges: [],
  developers: [
    {
      name: "NightShadess24",
      github: "https://github.com/NightShadess24",
    },
    {
      name: "Netsky (0.8 tracker)",
      github: "https://github.com/TheNetsky",
    },
  ],
} satisfies ExtensionInfo;
