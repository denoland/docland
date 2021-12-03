// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import type { DocNodeEnum, EnumMemberDef, Location } from "../deps.ts";
import { getState, setState, STYLE_OVERRIDE } from "../shared.ts";
import {
  Anchor,
  DocWithLink,
  SectionTitle,
  TARGET_RE,
  TocLink,
} from "./common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { codeBlockStyles, gtw, largeMarkdownStyles } from "./styles.ts";
import { TypeDef } from "./types.tsx";
import { take } from "../util.ts";
import type { Child } from "../util.ts";

export function EnumCodeBlock({ children }: { children: Child<DocNodeEnum> }) {
  const {
    name,
    enumDef: { members },
  } = take(children);
  const prev = getState(STYLE_OVERRIDE);
  setState(STYLE_OVERRIDE, codeBlockStyles);
  const keyword = gtw("keyword", codeBlockStyles);
  const items = members.map(({ name, init }) => (
    <div>
      {name}
      {init && (
        <span>
          {" "}= <TypeDef>{init}</TypeDef>
        </span>
      )},
    </div>
  ));
  const codeBlock = (
    <div class={gtw("code")}>
      <span class={keyword}>enum</span> {name} &#123; {items.length
        ? <div class={gtw("indent", codeBlockStyles)}>{items}</div>
        : undefined} &#125;
    </div>
  );
  setState(STYLE_OVERRIDE, prev);
  return codeBlock;
}

function Member(
  { children, name: enumName, location }: {
    children: Child<EnumMemberDef>;
    name: string;
    location: Location;
  },
) {
  const { name, init, jsDoc } = take(children);
  const id = name.replaceAll(TARGET_RE, "_");
  return (
    <div class={gtw("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      <div class={gtw("docEntry")}>
        <DocWithLink location={location}>
          {`${enumName}.${name}`}
          {init && (
            <span>
              {" "} = <TypeDef>{init}</TypeDef>
            </span>
          )}
        </DocWithLink>
        <JsDoc style={largeMarkdownStyles}>{jsDoc}</JsDoc>
      </div>
    </div>
  );
}

function byName(a: EnumMemberDef, b: EnumMemberDef): number {
  return a.name.localeCompare(b.name);
}

export function EnumDoc({ children }: { children: Child<DocNodeEnum> }) {
  const { name, enumDef: { members }, location } = take(children);
  const items = [...members].sort(byName).map((member) => (
    <Member name={name} location={location}>
      {member}
    </Member>
  ));
  return (
    <div class={gtw("docItems")}>
      <SectionTitle>Members</SectionTitle>
      {items}
    </div>
  );
}

export function EnumToc({ children }: { children: Child<DocNodeEnum> }) {
  const { name: enumName, enumDef: { members } } = take(children);
  const items = [...members].sort(byName).map(({ name }) => (
    <TocLink id={name}>{`${enumName}.${name}`}</TocLink>
  ));
  return (
    <div>
      <h3 class={gtw("tocHeader")}>Members</h3>
      <ul>
        {items}
      </ul>
    </div>
  );
}
