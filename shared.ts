// Copyright 2021 the Deno authors. All rights reserved. MIT license.

import type { StyleOverride } from "./components/styles.ts";
import {
  getState as nanoGetSate,
  setState as nanoSetState,
  setup,
  Store,
  twColors,
  virtualSheet,
} from "./deps.ts";
import type { DocNode, DocNodeNamespace } from "./deps.ts";

export const store = new Store({
  entries: [],
  namespaces: [],
  url: "",
  includePrivate: false,
});

export interface StoreState {
  entries: DocNode[];
  namespaces: DocNodeNamespace[];
  url: string;
  includePrivate: boolean;
}

export const sheet = virtualSheet();
setup({
  sheet,
  theme: {
    backgroundSize: {
      "4": "1rem",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: twColors.black,
      white: twColors.white,
      gray: twColors.coolGray,
      red: twColors.red,
      yellow: twColors.amber,
      green: twColors.emerald,
      cyan: twColors.cyan,
      blue: twColors.lightBlue,
      indigo: twColors.indigo,
      purple: twColors.fuchsia,
      pink: twColors.pink,
    },
  },
});

export const PRINT_THEME = "printer_styles";
export const STYLE_OVERRIDE = "style_override";

interface GetState {
  (id: typeof STYLE_OVERRIDE): StyleOverride | undefined;
  // deno-lint-ignore no-explicit-any
  (id: string): any;
}

interface SetState {
  (
    id: typeof STYLE_OVERRIDE,
    value: StyleOverride | undefined,
    // deno-lint-ignore no-explicit-any
  ): Map<string, any>;
  // deno-lint-ignore no-explicit-any
  (id: string, value: any): Map<string, any>;
}

export const getState = nanoGetSate as GetState;
export const setState = nanoSetState as SetState;

/** Labels for known "builtin" library documentation. */
const BUILTIN_LABELS: Record<string, string> = {
  "stable": "Deno CLI APIs",
  "unstable": "Deno CLI APIs (unstable)",
  "esnext": "ESNext APIs",
  "dom": "DOM APIs",
};
const BUILTIN_RE = /^deno\/([^@\/]+)(?:@([^\/]+))?\//;
const VERSIONED_LIBS: string[] = ["stable", "unstable"];

export function getLibWithVersion(url: string): [string, string | undefined] {
  const match = BUILTIN_RE.exec(url);
  if (match) {
    const [, lib, version] = match;
    const label = BUILTIN_LABELS[lib];
    if (label) {
      return [
        label,
        version ?? (VERSIONED_LIBS.includes(lib) ? "latest" : undefined),
      ];
    }
  }
  return [url.replace(/^\S+\/{2}/, ""), undefined];
}

/** Return a label for a URL, attempting to match the URL to the builtin label,
 * otherwise returning a string with the protocol stripped from the URL. */
export function getUrlLabel(url: string) {
  const match = BUILTIN_RE.exec(url);
  if (match) {
    const [, lib] = match;
    const label = BUILTIN_LABELS[lib];
    if (label) {
      return label;
    }
  }
  return url.replace(/^\S+\/{2}/, "");
}
