/* SPDX-License-Identifier: MIT */
/* Copyright 2024 Paperback Community */
/* From Nicartjay/PaperbackExt (converted from keiyoushi's Asura Scans), commit bf0f0dc. */

import {
  AdvancedSearchForm,
  InputRow,
  Section,
  SelectRow,
  type JSONObject,
} from "@paperback/types";

export interface AsuraScansSearchMeta extends JSONObject {
  sort: string[];
  status: string[];
  type: string[];
  genres: string[];
  minChapters: string;
}

export const SORT_OPTIONS = [
  { id: "latest", title: "Latest Update" },
  { id: "popular", title: "Popular" },
  { id: "rating", title: "Rating" },
  { id: "title", title: "A-Z" },
  { id: "update", title: "Newest" },
];

export const STATUS_OPTIONS = [
  { id: "", title: "All" },
  { id: "ongoing", title: "Ongoing" },
  { id: "completed", title: "Completed" },
  { id: "hiatus", title: "Hiatus" },
  { id: "dropped", title: "Dropped" },
  { id: "axed", title: "Axed" },
];

export const TYPE_OPTIONS = [
  { id: "", title: "All" },
  { id: "manhwa", title: "Manhwa" },
  { id: "manhua", title: "Manhua" },
  { id: "manga", title: "Manga" },
];

export const GENRE_OPTIONS = [
  "action",
  "adventure",
  "comedy",
  "crazy-mc",
  "demon",
  "drama",
  "dungeons",
  "fantasy",
  "game",
  "genius-mc",
  "isekai",
  "kuchikuchi",
  "magic",
  "martial-arts",
  "murim",
  "mystery",
  "necromancer",
  "overpowered",
  "regression",
  "reincarnation",
  "revenge",
  "romance",
  "school-life",
  "sci-fi",
  "shoujo",
  "shounen",
  "system",
  "tower",
  "tragedy",
  "villain",
  "violence",
].map((id) => ({
  id,
  title: id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
}));

export class AsuraScansSearchForm extends AdvancedSearchForm {
  private sort: string[];
  private status: string[];
  private type: string[];
  private genres: string[];
  private minChapters: string;

  constructor(initialMeta?: AsuraScansSearchMeta) {
    super();
    this.sort = initialMeta?.sort ?? [];
    this.status = initialMeta?.status ?? [];
    this.type = initialMeta?.type ?? [];
    this.genres = initialMeta?.genres ?? [];
    this.minChapters = initialMeta?.minChapters ?? "";
  }

  async updateSort(value: string[]): Promise<void> {
    this.sort = value;
    this.reloadForm();
  }

  async updateStatus(value: string[]): Promise<void> {
    this.status = value;
    this.reloadForm();
  }

  async updateType(value: string[]): Promise<void> {
    this.type = value;
    this.reloadForm();
  }

  async updateGenres(value: string[]): Promise<void> {
    this.genres = value;
    this.reloadForm();
  }

  async updateMinChapters(value: string): Promise<void> {
    this.minChapters = value;
    this.reloadForm();
  }

  getSearchQueryMetadata(): JSONObject {
    return {
      searchMeta: {
        sort: this.sort,
        status: this.status,
        type: this.type,
        genres: this.genres,
        minChapters: this.minChapters,
      } satisfies AsuraScansSearchMeta,
    };
  }

  override getSections() {
    return [
      Section("filters", [
        SelectRow("sort", {
          title: "Sort By",
          value: this.sort,
          options: SORT_OPTIONS,
          minItemCount: 0,
          maxItemCount: 1,
          onValueChange: Application.Selector(this as AsuraScansSearchForm, "updateSort"),
        }),
        SelectRow("status", {
          title: "Status",
          value: this.status,
          options: STATUS_OPTIONS,
          minItemCount: 0,
          maxItemCount: 1,
          onValueChange: Application.Selector(this as AsuraScansSearchForm, "updateStatus"),
        }),
        SelectRow("type", {
          title: "Type",
          value: this.type,
          options: TYPE_OPTIONS,
          minItemCount: 0,
          maxItemCount: 1,
          onValueChange: Application.Selector(this as AsuraScansSearchForm, "updateType"),
        }),
        SelectRow("genres", {
          title: "Genres",
          value: this.genres,
          options: GENRE_OPTIONS,
          minItemCount: 0,
          maxItemCount: GENRE_OPTIONS.length,
          onValueChange: Application.Selector(this as AsuraScansSearchForm, "updateGenres"),
        }),
        InputRow("min_chapters", {
          title: "Min. Chapters",
          value: this.minChapters,
          onValueChange: Application.Selector(this as AsuraScansSearchForm, "updateMinChapters"),
        }),
      ]),
    ];
  }
}
