// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { comrak, h, htmlEntities, lowlight, toHtml, tw } from "../deps.ts";
import { store } from "../shared.ts";
import type { StoreState } from "../shared.ts";
import type {
  Accessibility,
  JsDoc as JsDocNode,
  JsDocTag as JsDocTagNode,
  JsDocTagKind,
  JsDocTagNamed,
  JsDocTagParam,
  JsDocTagReturn,
  ParamDef,
  TsTypeParamDef,
} from "../deps.ts";
import { assert, take } from "../util.ts";
import type { Child } from "../util.ts";
import { getLink } from "./common.tsx";
import { gtw, tagMarkdownStyles } from "./styles.ts";
import type { StyleOverride } from "./styles.ts";

type Color =
  | "black"
  | "white"
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

interface DocParams {
  /** The JSDoc item to render. */
  children: Child<JsDocNode | undefined>;
  /** Overrides to the styling to apply. */
  style?: StyleOverride;
  /** An optional array of tags that if present in the JSDoc should be
   * rendered. */
  tags?: JsDocTagKind[];
  /** Only print tags that actually have some doc associated with them. */
  tagsWithDoc?: boolean;
}

await comrak.init();

/** Match up any `@param` tags in a JSDoc node to the passed parameters and
 * return the documentation. */
export function getParamDoc(
  params: ParamDef[],
  jsDoc?: JsDocNode,
): (string | undefined)[] {
  const docs = new Array(params.length);
  const tags = jsDoc?.tags?.filter(({ kind }) => kind === "param") as
    | JsDocTagParam[]
    | undefined;
  if (tags && tags.length) {
    const tagMap = new Map(tags.map((tag) => [tag.name, tag.doc]));
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      switch (param.kind) {
        case "array":
        case "assign":
        case "object":
          docs[i] = tagMap.get(`param${i}`);
          break;
        case "identifier":
          docs[i] = tagMap.get(param.name);
          break;
        case "rest":
          docs[i] = tagMap.get(
            param.arg.kind === "identifier" ? param.arg.name : `param${i}`,
          );
          break;
      }
    }
  }
  return docs;
}

/** Check a JSDoc node for any `@template` docs that match the name of the
 * type parameters and return them. */
export function getTypeParamDoc(
  typeParams: TsTypeParamDef[],
  jsDoc?: JsDocNode,
): (string | undefined)[] {
  const docs = new Array(typeParams.length);
  const tags = jsDoc?.tags?.filter(({ kind }) => kind === "template") as
    | JsDocTagNamed[]
    | undefined;
  if (tags && tags.length) {
    const tagMap = new Map(tags.map((tag) => [tag.name, tag.doc]));
    for (let i = 0; i < typeParams.length; i++) {
      const typeParam = typeParams[i];
      docs[i] = tagMap.get(typeParam.name);
    }
  }
  return docs;
}

/** Return any a documentation associated with the `@return`/`@returns` tag
 * in a JSDoc node. */
export function getReturnDoc(jsDoc?: JsDocNode): string | undefined {
  if (jsDoc && jsDoc.tags) {
    const returnTag = jsDoc.tags.find(({ kind }) =>
      kind === "return"
    ) as JsDocTagReturn;
    if (returnTag) {
      return returnTag.doc;
    }
  }
}

function hasDoc(tag: JsDocTagNode) {
  switch (tag.kind) {
    case "callback":
    case "deprecated":
    case "enum":
    case "example":
    case "extends":
    case "param":
    case "property":
    case "return":
    case "template":
    case "this":
    case "type":
    case "typedef":
      return !!tag.doc;
    default:
      return false;
  }
}

export function isDeprecated(jsDoc?: JsDocNode): boolean {
  if (jsDoc && jsDoc.tags) {
    return !!jsDoc.tags.find(({ kind }) => kind === "deprecated");
  }
  return false;
}

/** A component which renders a JSDoc. */
export function JsDoc({ children, style, tags = [], tagsWithDoc }: DocParams) {
  const jsDoc = take(children);
  if (!jsDoc) {
    return;
  }
  const docTags = [];
  if (jsDoc.tags) {
    for (const tag of jsDoc.tags) {
      if (
        (tags.includes(tag.kind) || tag.kind === "example") &&
        !(tagsWithDoc && !hasDoc(tag))
      ) {
        docTags.push(<JsDocTag>{tag}</JsDocTag>);
      }
    }
  }
  return (
    <div>
      <Markdown style={style}>{jsDoc.doc}</Markdown>
      {docTags.length
        ? <div class={tw`text-sm mx-4`}>{docTags}</div>
        : undefined}
    </div>
  );
}

function JsDocTag({ children }: { children: Child<JsDocTagNode> }) {
  const tag = take(children);
  switch (tag.kind) {
    case "callback":
    case "param":
    case "property":
    case "template":
    case "typedef":
      return (
        <div>
          <div>
            <span class={tw`italic`}>@{tag.kind}</span>{" "}
            <span class={tw`font-medium`}>{tag.name}</span>
          </div>
          <Markdown style={tagMarkdownStyles}>{tag.doc}</Markdown>
        </div>
      );
    case "constructor":
    case "module":
    case "private":
    case "protected":
    case "public":
    case "readonly":
      return (
        <div>
          <span class={tw`italic`}>@{tag.kind}</span>
        </div>
      );
    case "deprecated":
    case "enum":
    case "return":
      return (
        <div>
          <div>
            <span class={tw`italic`}>@{tag.kind}</span>
          </div>
          <Markdown style={tagMarkdownStyles}>{tag.doc}</Markdown>
        </div>
      );
    case "example": {
      const doc = tag.doc && !tag.doc.includes("```")
        ? `\`\`\`ts\n${tag.doc}${tag.doc.endsWith("\n") ? "" : "\n"}\`\`\``
        : tag.doc;
      return (
        <div>
          <div>
            <span class={tw`italic`}>@{tag.kind}</span>
          </div>
          <Markdown style={tagMarkdownStyles}>{doc}</Markdown>
        </div>
      );
    }
    case "extends":
    case "this":
    case "type":
      return (
        <div>
          <div>
            <span class={tw`italic`}>@{tag.kind}</span>{" "}
            <span class={tw`font-medium`}>{tag.type}</span>
          </div>
          <Markdown style={tagMarkdownStyles}>{tag.doc}</Markdown>
        </div>
      );
  }
}

const CODE_BLOCK_RE =
  /<pre><code\sclass="language-([^"]+)">([^<]+)<\/code><\/pre>/m;

/** Syntax highlight code blocks in an HTML string. */
function syntaxHighlight(html: string): string {
  let match;
  while ((match = CODE_BLOCK_RE.exec(html))) {
    const [text, lang, code] = match;
    const tree = lowlight.highlight(lang, htmlEntities.decode(code), {
      prefix: "code-",
    });
    assert(match.index != null);
    html = `${html.slice(0, match.index)}<pre><code>${
      toHtml(tree)
    }</code></pre>${html.slice(match.index + text.length)}`;
  }
  return html;
}

/** Matches `{@link ...}`, `{@linkcode ...}, and `{@linkplain ...}` structures
 * in JSDoc */
const JSDOC_LINK_RE = /\{\s*@link(code|plain)?\s+([^}]+)}/m;

/** Determines if the value looks like a relative or absolute path, or is
 * a URI with a protocol. */
function isLink(link: string): boolean {
  return /^\.{0,2}\//.test(link) || /^[A-Za-z]+:\S/.test(link);
}

/** Parse out at replace `@link` tags in JSDoc to a link if possible. */
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

export function Markdown(
  { children, style }: {
    children: Child<string | undefined>;
    style?: StyleOverride;
  },
) {
  const md = take(children);
  return md
    ? (
      <div class={gtw("markdown", style)}>
        {syntaxHighlight(comrak.markdownToHTML(parseLinks(md), {
          extension: {
            autolink: true,
            descriptionLists: true,
            strikethrough: true,
            table: true,
            tagfilter: true,
          },
        }))}
      </div>
    )
    : undefined;
}

export function AccessibilityTag(
  { children }: { children: Child<Accessibility | undefined> },
) {
  const accessibility = take(children);
  if (!accessibility || accessibility === "public") {
    return;
  }
  const color = accessibility === "private" ? "pink" : "indigo";
  return <Tag color={color}>{accessibility}</Tag>;
}

export function Tag(
  { children, color = "gray", style }: {
    children: unknown;
    color?: Color;
    style?: StyleOverride;
  },
) {
  return (
    <span>
      {" "}
      <span
        class={tw`bg-${color}(100 dark:800) text-${color}(800 dark:100) ${
          gtw("tag", style)
        }`}
      >
        {children}
      </span>
    </span>
  );
}
