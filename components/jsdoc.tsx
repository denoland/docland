// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, tw } from "../deps.ts";
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
import { take } from "../util.ts";
import type { Child } from "../util.ts";
import { MarkdownBlock } from "./markdown.tsx";
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
  /** An optional ID for the div containing the documentation in the JSDoc. */
  id?: string;
}

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
export function JsDoc(
  { children, style, tags = [], tagsWithDoc, id }: DocParams,
) {
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
      <MarkdownBlock style={style} id={id}>{jsDoc.doc}</MarkdownBlock>
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
          <MarkdownBlock style={tagMarkdownStyles}>{tag.doc}</MarkdownBlock>
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
          <MarkdownBlock style={tagMarkdownStyles}>{tag.doc}</MarkdownBlock>
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
          <MarkdownBlock style={tagMarkdownStyles}>{doc}</MarkdownBlock>
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
          <MarkdownBlock style={tagMarkdownStyles}>{tag.doc}</MarkdownBlock>
        </div>
      );
  }
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
