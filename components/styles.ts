// Copyright 2021 the Deno authors. All rights reserved. MIT license.
import { apply, css, tw } from "../deps.ts";
import type { CSSRules, Directive } from "../deps.ts";

export type BaseStyles = keyof typeof baseStyles;
export type StyleOverride = Partial<Record<BaseStyles, Directive<CSSRules>>>;

const anchor = css({
  ":global": {
    ":target, :target > *": apply`bg-gray(200 dark:800)`,
  },
  "margin-left": "-1em",
  "padding-right": "0.5em",
});

export const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

const code = css({
  ":not(pre) > code": apply
    `font-mono text-sm py-1 px-1.5 rounded text-black bg-gray-100 dark:(text-white bg-gray-800)`,
  pre: apply
    `font-mono text-sm p-2.5 rounded-lg text-black bg-gray-100 dark:(text-white bg-gray-800) overflow-x-auto`,
});

export const nav = css({
  "#nav-cb:checked ~ div label .menu": apply`hidden`,
  "#nav-cb:checked ~ div label .close, #nav-cb:checked ~ .nav": apply`block`,
});

const smallCode = css({
  ":not(pre) > code": apply
    `font-mono text-xs py-0.5 px-1 rounded bg-gray(100 dark:800)`,
  pre: apply
    `font-mono text-xs p-2 my-2 rounded-lg overflow-x-auto bg-gray(100 dark:800)`,
});

/** Styles that get applied to code blocks that come from markdown. */
const syntaxHighlighting = css({
  ".code-comment": apply`text-gray(500 dark:400)`,
  ".code-function": apply`text-green(700 dark:300)`,
  ".code-literal": apply`text-cyan(600 dark:400)`,
  ".code-keyword, .code-operator, .code-variable.code-language": apply
    `text-purple(800 dark:300)`,
  ".code-number, .code-doctag": apply`text-indigo(600 dark:400)`,
  ".code-regexp": apply`text-red(700 dark:300)`,
  ".code-string": apply`text-yellow(500 dark:200)`,
  ".code-type, .code-built_in": apply`text-cyan(600 dark:400) italic`,
});

const markdownStyles = css({
  a: apply`underline`,
  hr: apply`m-2 border-gray(500 dark:400)`,
  ol: apply`list-decimal lg:list-inside`,
  p: apply`my-1`,
  table: apply`table-auto`,
  th: apply`font-bold text-center`,
  ul: apply`lg:(list-disc list-inside)`,
});

const markdownSmallStyles = css({
  h1: apply`text-base py-2`,
  h2: apply`font-bold py-2`,
  h3: apply`font-semibold py-2`,
  h4: apply`font-italic py-2`,
  h5: apply`py-2`,
  h6: apply`py-2`,
  td: apply`p-1.5 border border(solid gray(500 dark:400))`,
});

const markdownLargeStyles = css({
  h1: apply`text-xl md:text-2xl lg:text-3xl`,
  h2: apply`text-lg md:text-xl lg:text-2xl`,
  h3: apply`font-bold md:(text-lg font-normal) lg:(text-xl font-normal)`,
  h4: apply`font-semibold md:(font-bold) lg:(text-lg font-normal)`,
  h5: apply`font-italic md:(font-semibold) lg:(font-bold)`,
  h6: apply`md:(font-italic) lg:(font-semibold)`,
  td: apply`p-2 border border(solid gray(500 dark:400))`,
});

const none = apply``;

const baseStyles = {
  anchor: apply
    `opacity-0 group-hover:opacity-100 absolute bg-transparent text-gray-600 dark:text-gray-400 ${anchor}`,
  bold: apply`font-bold`,
  boolean: none,
  classBody: apply`flex flex-col space-y-4`,
  classMethod: none,
  code: apply
    `font-mono my-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto`,
  content: apply`max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-4`,
  decorator: none,
  docEntry: apply`relative px-2`,
  docItem: apply`group relative py-2 px-1`,
  docItems: apply`mt-4`,
  docSubItem: apply`group relative py-2 px-1 ml-2.5`,
  docTitle: apply
    `text-2xl md:text-3xl lg:text-4xl text-gray(900 dark:50) font-bold mb-3`,
  error: apply
    `bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6 dark:(border-red-700 text-red-500)`,
  formButton: apply
    `transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray(600 dark:100) font-medium rounded-lg hover:shadow-lg w-full bg-cyan(100 dark:700)`,
  fnName: none,
  keyword: none,
  indent: apply`ml-4`,
  insideButton: apply
    `transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray(600 dark:200) font-medium rounded-lg hover:shadow-lg bg-cyan(100 dark:700)`,
  leftNav: apply
    `p-6 bg-gray-100 border-b border-gray-300 sm:py-12 lg:(bg-transparent border-b-0 border-r border-gray-200) dark:(bg-gray-900 border-gray-800 lg:border-gray-700)`,
  link: apply`hover:text-blue(800 dark:300)`,
  list: apply`ml-4 list-none space-y-2.5 lg:(list-disc list-inside space-y-0)`,
  main: apply`max-w-screen-sm mx-auto mt-10 px-4 sm:px-6 md:(px-8 mt-20)`,
  mainBox: apply`p-6 md:(col-span-3 p-12)`,
  mainHeader: apply`text-3xl font-bold lg:text-5xl`,
  markdown: apply
    `ml-4 mr-2 py-2 text-sm text-justify ${smallCode} ${markdownStyles} ${markdownSmallStyles} ${syntaxHighlighting}`,
  numberLiteral: none,
  nodeClass: apply`text-green(800 dark:400) mx-2 font-bold truncate`,
  nodeEnum: apply`text-green(700 dark:500) mx-2 font-bold truncate`,
  nodeFunction: apply`text-cyan(800 dark:400) mx-2 font-bold truncate`,
  nodeInterface: apply`text-cyan(900 dark:300) mx-2 font-bold truncate`,
  nodeTypeAlias: apply`text-yellow(700 dark:500) mx-2 font-bold truncate`,
  nodeVariable: apply`text-blue(700 dark:500) mx-2 font-bold truncate`,
  nodeNamespace: apply`text-yellow(800 dark:400) mx-2 font-bold truncate`,
  section: apply`text-2xl border-b border-gray(400 dark:600) p-2 mt-1 mb-3`,
  subSection: apply`text-xl p-2 mx-2.5 mt-1 mb-2.5`,
  stringLiteral: none,
  tag: apply
    `px-2 inline-flex text-xs leading-5 font-semibold lowercase rounded-full`,
  tocHeader: apply`text-gray(900 dark:50) mt-3 mb-1 text-xl font-bold`,
  typeKeyword: none,
  typeLink: apply`underline`,
  typeParam: none,
  url: apply`hover:text-blue(800 dark:400) underline`,
} as const;

export const codeBlockStyles = {
  boolean: apply`text-cyan(600 dark:400)`,
  classMethod: apply`text-green(700 dark:300)`,
  decorator: apply`text-green(600 dark:400) italic`,
  fnName: apply`text-green(700 dark:300)`,
  keyword: apply`text-purple(800 dark:300)`,
  numberLiteral: apply`text-indigo(600 dark:400)`,
  stringLiteral: apply`text-yellow(500 dark:200)`,
  typeKeyword: apply`text-cyan(600 dark:400) italic`,
  typeParam: apply`text-blue(600 dark:400)`,
} as const;

export const largeMarkdownStyles = {
  markdown: apply
    `p-4 flex flex-col space-y-4 text-justify ${markdownStyles} ${markdownLargeStyles} ${code} ${syntaxHighlighting}`,
} as const;

export const largeTagStyles = {
  tag: apply
    `px-4 py-2 inline-flex leading-5 font-semibold lowercase rounded-full`,
} as const;

export const tagMarkdownStyles = {
  markdown: apply
    `p-1.5 mx-2.5 flex flex-col text-justify ${markdownStyles} ${markdownSmallStyles} ${smallCode} ${syntaxHighlighting}`,
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
