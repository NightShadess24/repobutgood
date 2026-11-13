/* SPDX-License-Identifier: MIT */
/* Copyright 2024 Paperback Community */
/* From Nicartjay/PaperbackExt (converted from keiyoushi's Asura Scans), commit bf0f0dc. */

import { Form, Section, ToggleRow } from "@paperback/types";

const HIDE_PREMIUM_KEY = "asurascans.hidePremium";

export function getHidePremium(): boolean {
  const value = Application.getState(HIDE_PREMIUM_KEY);
  return typeof value === "boolean" ? value : true;
}

function setHidePremium(value: boolean): void {
  Application.setState(value, HIDE_PREMIUM_KEY);
}

export class AsuraScansSettingsForm extends Form {
  private hidePremium: boolean;

  constructor() {
    super();
    this.hidePremium = getHidePremium();
  }

  async updateHidePremium(value: boolean): Promise<void> {
    this.hidePremium = value;
    setHidePremium(value);
    this.reloadForm();
  }

  override getSections() {
    return [
      Section({ id: "chapters", footer: "Hide locked premium chapters from the list." }, [
        ToggleRow("hide_premium_chapters", {
          title: "Hide premium chapters",
          value: this.hidePremium,
          onValueChange: Application.Selector<
            AsuraScansSettingsForm,
            (value: boolean) => Promise<void>
          >(this, "updateHidePremium"),
        }),
      ]),
    ];
  }
}
