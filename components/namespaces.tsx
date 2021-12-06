// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import type { DocNodeNamespace } from "../deps.ts";
import { store } from "../shared.ts";
import type { StoreState } from "../shared.ts";
import { take } from "../util.ts";
import type { Child } from "../util.ts";
import { asCollection, Section, TocLink } from "./common.tsx";
import type { DocProps } from "./common.tsx";
import { gtw } from "./styles.ts";

export function NamespaceDoc(
  { children, path = [] }: DocProps<DocNodeNamespace>,
) {
  const node = take(children);
  const { name, namespaceDef: { elements } } = node;
  const { includePrivate } = store.state as StoreState;
  const collection = asCollection(
    elements,
    [...path, name].join("."),
    includePrivate,
  );
  return (
    <div>
      {collection.namespace && (
        <Section title="Namespace" style="nodeNamespace">
          {collection.namespace}
        </Section>
      )}
      {collection.class && (
        <Section title="Classes" style="nodeClass">
          {collection.class}
        </Section>
      )}
      {collection.enum && (
        <Section title="Enums" style="nodeEnum">
          {collection.enum}
        </Section>
      )}
      {collection.variable && (
        <Section title="Variables" style="nodeVariable">
          {collection.variable}
        </Section>
      )}
      {collection.function && (
        <Section title="Functions" style="nodeFunction">
          {collection.function}
        </Section>
      )}
      {collection.interface && (
        <Section title="Interfaces" style="nodeInterface">
          {collection.interface}
        </Section>
      )}
      {collection.typeAlias && (
        <Section title="Type Aliases" style="nodeTypeAlias">
          {collection.typeAlias}
        </Section>
      )}
    </div>
  );
}

export function NamespaceToc(
  { children }: { children: Child<DocNodeNamespace> },
) {
  const { name, namespaceDef: { elements } } = take(children);
  const { includePrivate } = store.state as StoreState;
  const collection = asCollection(elements, undefined, includePrivate);
  return (
    <div>
      <h3 class={gtw("tocHeader")}>
        {name}
      </h3>
      <ul>
        {collection.namespace && <TocLink>Namespaces</TocLink>}
        {collection.class && <TocLink>Classes</TocLink>}
        {collection.enum && <TocLink>Enums</TocLink>}
        {collection.variable && <TocLink>Variables</TocLink>}
        {collection.function && <TocLink>Functions</TocLink>}
        {collection.interface && <TocLink>Interfaces</TocLink>}
        {collection.typeAlias && <TocLink>Type Aliases</TocLink>}
      </ul>
    </div>
  );
}
