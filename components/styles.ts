// Copyright 2021 the Deno authors. All rights reserved. MIT license.
import { apply, css, theme, tw } from "../deps.ts";
import type { CSSRules, Directive } from "../deps.ts";

export type BaseStyles = keyof typeof baseStyles;
export type StyleOverride = Partial<Record<BaseStyles, Directive<CSSRules>>>;

const anchor = css({
  ":global": {
    ":target, :target > *": {
      "background-color": theme("colors.gray.200"),
    },
  },
  "color": theme("colors.gray.600"),
  "background-color": "transparent",
  "margin-left": "-1em",
  "padding-right": "0.5em",
});

const app = css({
  "grid-template-rows": "auto 1fr auto",
});

const buttonGradient = css({
  "background":
    "linear-gradient(279.56deg, rgb(238, 255, 245) -52.57%, rgb(186, 233, 239) 126.35%)",
});

const code = css({
  ":not(pre) > code": apply
    `font-mono text-sm py-1 px-1.5 rounded text-black bg-gray-100`,
  pre: apply
    `font-mono text-sm p-2.5 rounded-lg text-black bg-gray-100 overflow-x-auto`,
});

export const nav = css({
  "#nav-cb:checked ~ div label .menu": apply`hidden`,
  "#nav-cb:checked ~ div label .close, #nav-cb:checked ~ .nav": apply`block`,
});

const smallCode = css({
  ":not(pre) > code": apply`font-mono text-xs py-0.5 px-1 rounded bg-gray-100`,
  pre: apply`font-mono text-xs p-2 my-2 rounded-lg bg-gray-100 overflow-x-auto`,
});

const none = apply``;

const baseStyles = {
  anchor: apply`opacity-0 group-hover:opacity-100 absolute ${anchor}`,
  app: apply`min-h-screen grid grid-cols-1 ${app}`,
  bold: apply`font-bold`,
  boolean: none,
  classBody: apply`flex flex-col space-y-4`,
  classMethod: none,
  code: apply`font-mono my-4 p-3 rounded-lg bg-gray-50 overflow-x-auto`,
  content: apply`max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-4`,
  docEntry: apply`relative px-2`,
  docItem: apply`group relative py-2 px-1`,
  docItems: apply`mt-4`,
  docSubItem: apply`group relative py-2 px-1 ml-2.5`,
  docTitle: apply
    `text-2xl md:text-3xl lg:text-4xl text-gray-900 font-bold mb-3`,
  error: apply`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6`,
  formButton: apply
    `transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium rounded-lg hover:shadow-lg w-full ${buttonGradient}`,
  fnName: none,
  keyword: none,
  indent: apply`ml-4`,
  insideButton: apply
    `transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium rounded-lg hover:shadow-lg ${buttonGradient}`,
  link: apply`hover:text-blue-800`,
  list: apply`ml-4 list-disc list-inside`,
  // main: apply`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`,
  main: apply`max-w-screen-sm mx-auto mt-10 px-4 sm:px-6 md:(px-8 mt-20)`,
  mainBox: apply`p-6 md:col-span-3 md:p-12`,
  mainHeader: apply`text-3xl font-bold lg:text-5xl`,
  markdown: apply`ml-4 mr-2 py-2 text-sm ${smallCode}`,
  numberLiteral: none,
  nodeClass: apply`text-green-800 mx-2 font-bold truncate`,
  nodeEnum: apply`text-green-700 mx-2 font-bold truncate`,
  nodeFunction: apply`text-cyan-800 mx-2 font-bold truncate`,
  nodeInterface: apply`text-cyan-900 mx-2 font-bold truncate`,
  nodeTypeAlias: apply`text-yellow-700 mx-2 font-bold truncate`,
  nodeVariable: apply`text-blue-700 mx-2 font-bold truncate`,
  nodeNamespace: apply`text-yellow-800 mx-2 font-bold truncate`,
  section: apply`text-2xl border-b border-gray-400 p-2 mt-1 mb-3`,
  subSection: apply`text-xl p-2 mx-2.5 mt-1 mb-2.5`,
  stringLiteral: none,
  tag: apply
    `px-2 inline-flex text-xs leading-5 font-semibold lowercase rounded-full`,
  tocHeader: apply`text-gray-900 mt-3 mb-1 text-xl font-bold`,
  typeKeyword: none,
  typeLink: apply`underline`,
  typeParam: none,
  url: apply`hover:text-blue-800 underline`,
} as const;

export const codeBlockStyles = {
  boolean: apply`text-cyan-600`,
  classMethod: apply`text-green-700`,
  fnName: apply`text-green-700`,
  keyword: apply`text-purple-800`,
  numberLiteral: apply`text-indigo-600`,
  stringLiteral: apply`text-yellow-400`,
  typeKeyword: apply`text-cyan-600 italic`,
  typeParam: apply`text-blue-600`,
} as const;

export const largeMarkdownStyles = {
  markdown: apply`p-4 flex flex-col space-y-4 ${code}`,
} as const;

export const largeTagStyles = {
  tag: apply
    `px-4 py-2 inline-flex leading-5 font-semibold lowercase rounded-full`,
} as const;

export const tagMarkdownStyles = {
  markdown: apply`p-1.5 mx-2.5 flex flex-col ${smallCode}`,
} as const;

function getStyle(
  key: BaseStyles,
  ...overrides: (StyleOverride | undefined)[]
): Directive<CSSRules> {
  for (const override of overrides) {
    if (!override) {
      continue;
    }
    const style = override[key];
    if (style) {
      return style;
    }
  }
  return baseStyles[key];
}

/** Get a twind style, applying any overrides. */
export function gtw(
  key: BaseStyles,
  ...overrides: (StyleOverride | undefined)[]
) {
  return tw`${getStyle(key, ...overrides)}`;
}
