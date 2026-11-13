/* SPDX-License-Identifier: MIT */
/* Copyright 2024 Paperback Community */
/* From Nicartjay/PaperbackExt (converted from keiyoushi's Asura Scans), commit bf0f0dc. */

import type { ExtensionInfo } from "@paperback/types";
import { ContentRating, SourceIntents } from "@paperback/types";

export default {
  name: "Asura Scans",
  description: "Asura Scans - custom source (asurascans.com). Converted from keiyoushi.",
  version: "1.4.71.1",
  icon: "icon.png",
  language: "en",
  contentRating: ContentRating.EVERYONE,
  capabilities: [
    SourceIntents.DISCOVER_SECTION_PROVIDING,
    SourceIntents.SEARCH_RESULT_PROVIDING,
    SourceIntents.CHAPTER_PROVIDING,
    SourceIntents.CLOUDFLARE_BYPASS_PROVIDING,
    SourceIntents.SETTINGS_FORM_PROVIDING,
  ],
  badges: [],
  developers: [{ name: "nicartjay" }, { name: "keiyoushi" }],
} satisfies ExtensionInfo;
