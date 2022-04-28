// Copyright 2022 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { comrak, type DocNode, h } from "../deps.ts";
import { store, type StoreState } from "../shared.ts";
import { type Child, take } from "../util.ts";
import { getLink, syntaxHighlight } from "./common.tsx";
import { gtw, type StyleOverride } from "./styles.ts";

await comrak.init();

/** Matches `{@link ...}`, `{@linkcode ...}, and `{@linkplain ...}` structures
 * in JSDoc */
const JSDOC_LINK_RE = /\{\s*@link(code|plain)?\s+([^}]+)}/m;

const MARKDOWN_OPTIONS: comrak.ComrakOptions = {
  extension: {
    autolink: true,
    descriptionLists: true,
    strikethrough: true,
    superscript: true,
    table: true,
    tagfilter: true,
  },
};

/** Give a doc node, get only the first paragraph of the JSDoc. */
export function getDocSummary(docNode: DocNode) {
  if (docNode.jsDoc?.doc) {
    const [summary] = docNode.jsDoc.doc.split("\n\n");
    return summary;
  }
}

/** Determines if the value looks like a relative or absolute path, or is
 * a URI with a protocol. */
function isLink(link: string): boolean {
  return /^\.{0,2}\//.test(link) || /^[A-Za-z]+:\S/.test(link);
}

/** Parse out and replace `@link` tags in JSDoc to a link if possible. */
function parseLinks(markdown: string): string {
  let match;
  const { url, entries, namespaces } = store.state as StoreState;
  while ((match = JSDOC_LINK_RE.exec(markdown))) {
    const [text, modifier, value] = match;
    let link = value;
    let title;
    const indexOfSpace = value.indexOf(" ");
    const indexOfPipe = value.indexOf("|");
    if (indexOfPipe >= 0) {
      link = value.slice(0, indexOfPipe);
      title = value.slice(indexOfPipe + 1).trim();
    } else if (indexOfSpace >= 0) {
      link = value.slice(0, indexOfSpace);
      title = value.slice(indexOfSpace + 1).trim();
    }
    const href = getLink(link, url, entries, namespaces);
    if (href) {
      if (!title) {
        title = link;
      }
      link = href;
    }
    let replacement;
    if (isLink(link)) {
      if (title) {
        replacement = modifier === "code"
          ? `[\`${title}\`](${link})`
          : `[${title}](${link})`;
      } else {
        replacement = modifier === "code"
          ? `[\`${link}\`](${link})`
          : `[${link}](${link})`;
      }
    } else {
      replacement = modifier === "code"
        ? `{_@link_ \`${link}\`${title ? ` | ${title}` : ""}}`
        : `{_@link_ ${link}${title ? ` | ${title}` : ""}}`;
    }
    markdown = `${markdown.slice(0, match.index)}${replacement}${
      markdown.slice(match.index + text.length)
    }`;
  }
  return markdown;
}

export function MarkdownBlock(
  { children, style, id }: {
    children: Child<string | undefined>;
    style?: StyleOverride;
    id?: string;
  },
) {
  const md = take(children);
  return md
    ? (
      <div
        class={gtw("markdown", style)}
        id={id}
        innerHTML={{
          __dangerousHtml: syntaxHighlight(
            comrak.markdownToHTML(parseLinks(md), MARKDOWN_OPTIONS),
          ),
        }}
      >
      </div>
    )
    : undefined;
}

export function MarkdownSummary(
  { children, style }: {
    children: Child<string | undefined>;
    style?: StyleOverride;
  },
) {
  const md = take(children);
  return md
    ? (
      <span
        class={gtw("markdownSummary", style)}
        innerHTML={{
          __dangerousHtml: comrak.markdownToHTML(
            parseLinks(md),
            MARKDOWN_OPTIONS,
          ),
        }}
      />
    )
    : undefined;
}
