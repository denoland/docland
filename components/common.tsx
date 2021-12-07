// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, tw } from "../deps.ts";
import type {
  DocNode,
  DocNodeClass,
  DocNodeEnum,
  DocNodeFunction,
  DocNodeImport,
  DocNodeInterface,
  DocNodeModuleDoc,
  DocNodeNamespace,
  DocNodeTypeAlias,
  DocNodeVariable,
  Location,
} from "../deps.ts";
import { take } from "../util.ts";
import type { Child } from "../util.ts";
import { store } from "../shared.ts";
import type { StoreState } from "../shared.ts";
import { isDeprecated, JsDoc, Tag } from "./jsdoc.tsx";
import { gtw } from "./styles.ts";
import type { BaseStyles } from "./styles.ts";

export interface DocNodeCollection {
  moduleDoc?: [string, DocNodeModuleDoc][];
  import?: [string, DocNodeImport][];
  namespace?: [string, DocNodeNamespace][];
  class?: [string, DocNodeClass][];
  enum?: [string, DocNodeEnum][];
  variable?: [string, DocNodeVariable][];
  function?: [string, DocNodeFunction][];
  interface?: [string, DocNodeInterface][];
  typeAlias?: [string, DocNodeTypeAlias][];
}

export interface DocProps<Node extends DocNode> {
  children: Child<Node>;
  path?: string[];
}

export interface NodeProps<Node extends DocNode> {
  children: Child<Node>;
  path?: string[];
  style: BaseStyles;
}

interface NodesProps<Node extends DocNode> {
  children: Child<Node[]>;
  path?: string[];
  style: BaseStyles;
  title: string;
}

export const TARGET_RE = /(\s|[\[\]])/g;

export function isAbstract(node: DocNode) {
  if (node.kind === "class") {
    return node.classDef.isAbstract;
  } else {
    return false;
  }
}

function append(
  collection: DocNodeCollection,
  entries: DocNode[],
  path?: string,
  includePrivate?: boolean,
) {
  for (const entry of entries) {
    if (includePrivate || entry.declarationKind !== "private") {
      const docNodes: [string, DocNode][] = collection[entry.kind] ??
        (collection[entry.kind] = []);
      const label = path ? `${path}.${entry.name}` : entry.name;
      docNodes.push([label, entry]);
      if (entry.kind === "namespace") {
        append(collection, entry.namespaceDef.elements, label, includePrivate);
      }
    }
  }
}

export function asCollection(
  entries: DocNode[],
  path?: string,
  includePrivate = false,
): DocNodeCollection {
  const collection: DocNodeCollection = {};
  append(collection, entries, path, includePrivate);
  return collection;
}

function byName(a: [string, DocNode], b: [string, DocNode]) {
  return a[0].localeCompare(b[0]);
}

function getName(node: DocNode, path?: string[]) {
  return path ? [...path, node.name].join(".") : node.name;
}

export function Anchor({ children: name }: { children: string }) {
  return (
    <a
      href={`#${name}`}
      class={gtw("anchor")}
      aria-label="Anchor"
      tabIndex={-1}
    >
      §
    </a>
  );
}

export function DocTitle(
  { children, path }: { children: Child<DocNode>; path?: string[] },
) {
  const node = take(children);
  return <h1 class={gtw("docTitle")}>{getName(node, path)}</h1>;
}

function Entry<Node extends DocNode>(
  { children, style }: {
    children: Child<[string, Node]>;
    style: BaseStyles;
  },
) {
  const [label, node] = take(children);
  return (
    <li>
      <h3 class={gtw(style)}>
        <NodeLink>{label}</NodeLink>
        {isAbstract(node) ? <Tag color="yellow">abstract</Tag> : undefined}
        {isDeprecated(node.jsDoc)
          ? <Tag color="gray">deprecated</Tag>
          : undefined}
      </h3>
      <JsDoc>{node.jsDoc}</JsDoc>
    </li>
  );
}

export function NodeLink({ children }: { children: Child<string> }) {
  const label = take(children);
  const { url } = store.state as StoreState;
  const href = `/${url}${url.endsWith("/") ? "" : "/"}~/${label}`;
  return <a href={href}>{label}</a>;
}

export function SectionTitle({ children }: { children: Child<string> }) {
  const name = take(children);
  const id = name.replaceAll(TARGET_RE, "_");
  return (
    <h2 class={gtw("section")} id={id}>
      <Anchor>{id}</Anchor>
      {name}
    </h2>
  );
}

export function Section<Node extends DocNode>(
  { children, style, title }: {
    children: Child<[string, Node][]>;
    style: BaseStyles;
    title: string;
  },
) {
  const nodes = take(children);
  const displayed = new Set();
  const items = nodes.sort(byName).map(([label, node]) => {
    if (displayed.has(label)) {
      return;
    }
    displayed.add(label);
    return <Entry style={style}>{[label, node]}</Entry>;
  });
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <ul>{items}</ul>
    </div>
  );
}

export function SubSectionTitle(
  { children, id }: { children: Child<string>; id: string },
) {
  const name = take(children);
  const target = `${id}_${name.replaceAll(TARGET_RE, "_")}`;
  return (
    <h3 class={gtw("subSection")} id={target}>
      <Anchor>{target}</Anchor>
      {name}
    </h3>
  );
}

export function DocWithLink(
  { children, location }: {
    children: unknown;
    location?: Location;
  },
) {
  let href;
  if (location) {
    try {
      const url = new URL(location.filename);
      url.hash = `L${location.line}`;
      href = url.toString();
    } catch {
      // we just swallow here
    }
  }
  return (
    <div class={tw`flex justify-between`}>
      <div class={tw`overflow-auto font-mono break-words`}>{children}</div>
      {href &&
        (
          <a
            href={href}
            target="_blank"
            class={tw
              `pl-2 break-words text-gray-600 hover:text-gray-800 hover:underline`}
          >
            [src]
          </a>
        )}
    </div>
  );
}

export function IconLink() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="link"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class={tw`h-3 mr-1 inline-block`}
    >
      <path
        fill="currentColor"
        d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"
      >
      </path>
    </svg>
  );
}

export function TocLink(
  { children, id }: { children: Child<string>; id?: string },
) {
  const name = take(children);
  const href = (id ?? name).replaceAll(TARGET_RE, "_");
  return (
    <li>
      <a href={`#${href}`} class={tw`truncate`}>{name}</a>
    </li>
  );
}
