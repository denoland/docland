// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import type { DecoratorDef } from "../deps.ts";
import { getState, store, STYLE_OVERRIDE } from "../shared.ts";
import type { StoreState } from "../shared.ts";
import { take } from "../util.ts";
import type { Child } from "../util.ts";
import {
  Anchor,
  DocWithLink,
  SectionTitle,
  SubSectionTitle,
} from "./common.tsx";
import { gtw } from "./styles.ts";

function getHref(name: string): string | undefined {
  const { entries, url, namespaces } = store.state as StoreState;
  const [item, ...path] = name.split(".");
  const anchor = path.join("_");
  let link;
  const ns = [...namespaces ?? []];
  let namespace;
  let namespacePath;
  while ((namespace = ns.pop())) {
    link = namespace.namespaceDef.elements.find((e) => e.name === item);
    if (link) {
      namespacePath = [...ns.map((n) => n.name), namespace.name].join(".");
      break;
    }
  }
  if (!link) {
    link = entries.find((e) => e.name === item);
    if (!link) {
      return;
    }
  }
  const ref = link.kind === "import" ? link.importDef.src : url;
  const refItem = namespacePath ? `${namespacePath}.${link.name}` : link.name;
  return `/${ref}${ref.endsWith("/") ? "" : "/"}~/${refItem}${
    anchor && `#${anchor}`
  }`;
}

function DecoratorArgs({ children }: { children: Child<string[]> }) {
  const args = take(children, true);
  return <span>({args.join(", ")})</span>;
}

function Decorator({ children }: { children: Child<DecoratorDef> }) {
  const { name, args } = take(children);
  const so = getState(STYLE_OVERRIDE);
  const href = getHref(name);
  return (
    <div>
      @<span class={gtw("decorator", so)}>
        {href ? <a href={href} class={gtw("typeLink", so)}>{name}</a> : name}
      </span>
      {args && <DecoratorArgs>{args}</DecoratorArgs>}
    </div>
  );
}

export function Decorators({ children }: { children: Child<DecoratorDef[]> }) {
  const decorators = take(children, true);
  if (!decorators.length) {
    return;
  }

  return (
    <div>
      {decorators.map((decorator) => <Decorator>{decorator}</Decorator>)}
    </div>
  );
}

export function DecoratorsDoc(
  { children }: { children: Child<DecoratorDef[]> },
) {
  const decorators = take(children, true);
  if (!decorators.length) {
    return;
  }

  return (
    <div>
      <SectionTitle>Decorators</SectionTitle>
      {decorators.map((d) => {
        return (
          <div class={gtw("docItem")} id={d.name}>
            <Anchor>{d.name}</Anchor>
            <div class={gtw("docEntry")}>
              <DocWithLink location={d.location}>
                <Decorator>{d}</Decorator>
              </DocWithLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DecoratorsSubDoc(
  { children, id }: { children: Child<DecoratorDef[]>; id: string },
) {
  const decorators = take(children, true);
  if (!decorators.length) {
    return;
  }

  return (
    <div>
      <SubSectionTitle id={id}>Decorators</SubSectionTitle>
      {decorators.map((d) => {
        const itemId = `${id}_decorator_${d.name}`;
        return (
          <div class={gtw("docSubItem")} id={itemId}>
            <Anchor>{itemId}</Anchor>
            <div class={gtw("docEntry")}>
              <DocWithLink location={d.location}>
                <Decorator>{d}</Decorator>
              </DocWithLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}
