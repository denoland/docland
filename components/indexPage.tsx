// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
/** @jsxFrag Fragment */

import {
  apply,
  css,
  type DocNode,
  type DocNodeKind,
  Fragment,
  h,
  tw,
} from "../deps.ts";
import { type IndexStructure } from "../docs.ts";
import { store, type StoreState } from "../shared.ts";
import { type Child, take } from "../util.ts";
import { MarkdownSummary } from "./markdown.tsx";
import { IndexMeta } from "./meta.tsx";
import { SideBarHeader } from "./sidebar.tsx";
import { gtw } from "./styles.ts";

const panel = css({
  "& > input:checked ~ table": apply`hidden`,
  "& > input:checked ~ label > img": apply`rotate-0`,
});

function getDocSummary(docNode: DocNode) {
  if (docNode.jsDoc?.doc) {
    const [summary] = docNode.jsDoc.doc.split("\n\n");
    return summary;
  }
}

function getModuleSummary(
  mod: string,
  entries: Map<string, DocNode[]>,
): string | undefined {
  const docNodes = entries.get(mod);
  if (docNodes) {
    for (const docNode of docNodes) {
      if (docNode.kind === "moduleDoc") {
        return getDocSummary(docNode);
      }
    }
  }
}

function ExportSymbol(
  { children, base, name, kind }: {
    children: Child<string | undefined>;
    base: string;
    name: string;
    kind: DocNodeKind;
  },
) {
  const summary = take(children);
  const href = `${base}/~/${name}`;
  let linkClass;
  switch (kind) {
    case "class":
      linkClass = tw`text-green(800 dark:400) font-bold hover:underline`;
      break;
    case "enum":
      linkClass = tw`text-green(700 dark:500) font-bold hover:underline`;
      break;
    case "function":
      linkClass = tw`text-cyan(800 dark:400) font-bold hover:underline`;
      break;
    case "interface":
      linkClass = tw`text-cyan(900 dark:300) font-bold hover:underline`;
      break;
    case "typeAlias":
      linkClass = tw`text-yellow(700 dark:500) font-bold hover:underline`;
      break;
    case "variable":
      linkClass = tw`text-blue(700 dark:500) font-bold hover:underline`;
      break;
    case "namespace":
      linkClass = tw`text-yellow(800 dark:400) font-bold hover:underline`;
      break;
    default:
      linkClass = tw`hover:underline`;
  }
  return (
    <tr>
      <td class={tw`px-2 align-top`}>
        <a href={href} class={linkClass}>{name}</a>
      </td>
      <td class={tw`px-2 align-top`}>
        <MarkdownSummary>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

function Mod(
  { children, name, base }: {
    children: Child<DocNode[]>;
    base: string;
    name: string;
  },
) {
  const entries = take(children, true);
  const nodeMap = new Map<string, { kind: DocNodeKind; summary?: string }>();
  let modSummary;
  for (const node of entries) {
    if (node.declarationKind === "export") {
      if (node.kind === "moduleDoc") {
        modSummary = getDocSummary(node);
      } else {
        const prev = nodeMap.get(node.name);
        if (prev) {
          if (!prev.summary) {
            prev.summary = getDocSummary(node);
          }
        } else {
          nodeMap.set(node.name, {
            kind: node.kind,
            summary: getDocSummary(node),
          });
        }
      }
    }
  }
  const items = Array.from(nodeMap).map(([name, { kind, summary }]) => ({
    name,
    kind,
    summary,
  }));
  items.sort((a, b) => a.name.localeCompare(b.name));
  const href = `${base}${name}`;
  const state = store.state as StoreState;
  state.entries = entries;
  state.url = href.slice(1);
  store.setState(state);
  const exports = items.map(({ name, kind, summary }) => (
    <ExportSymbol base={href} name={name} kind={kind}>
      {summary}
    </ExportSymbol>
  ));
  return (
    <>
      <tr>
        <td colSpan={2} class={tw`py-2`}>
          <a
            href={href}
            class={tw`pr-4 text-blue(800 dark:300) hover:underline`}
          >
            {name}
          </a>
          <MarkdownSummary>{modSummary}</MarkdownSummary>
        </td>
      </tr>
      {exports}
    </>
  );
}

function Mods(
  { children, base, entries }: {
    children: Child<string[]>;
    base: string;
    entries: Map<string, DocNode[]>;
  },
) {
  const mods = take(children, true);
  const items = [];
  for (const mod of mods) {
    const nodes = entries.get(mod);
    if (nodes) {
      items.push(<Mod name={mod} base={base}>{nodes}</Mod>);
    }
  }
  return (
    <table class={tw`m-4`}>
      <tbody>
        {items}
      </tbody>
    </table>
  );
}

function Group(
  { children, base, path, isCurrent, entries, expanded = false }: {
    children: Child<string[]>;
    base: string;
    isCurrent: boolean;
    path: string;
    entries: Map<string, DocNode[]>;
    expanded?: boolean;
  },
) {
  const mods = take(children, true);
  const summary = mods.length === 1
    ? getModuleSummary(mods[0], entries)
    : undefined;
  const id = path.slice(1).replaceAll(/[\s/]/g, "_");
  const href = `${base}${path}`;
  return (
    <div class={tw`${panel}`} id={`group_${id}`}>
      {expanded
        ? (
          <input
            type="checkbox"
            id={`id_${id}`}
            class={tw`hidden`}
            aria-expanded={expanded}
            aria-controls={`group_${id}`}
          />
        )
        : (
          <input
            type="checkbox"
            id={`id_${id}`}
            checked
            class={tw`hidden`}
            aria-expanded={expanded}
            aria-controls={`group_${id}`}
          />
        )}
      <label
        for={`id_${id}`}
        class={tw`block p-2 border(b gray(400 dark:600)) cursor-pointer`}
      >
        <img
          class={tw`inline rotate-90 dark:(filter invert) mr-2`}
          height="24"
          width="24"
          src="/static/arrow_right.svg"
        />
        <span class={tw`mr-4`}>
          {isCurrent ? path : (
            <a
              href={href}
              class={tw`text-blue(800 dark:300) hover:underline`}
            >
              {path}
            </a>
          )}
        </span>
        <MarkdownSummary>{summary}</MarkdownSummary>
      </label>
      <Mods base={base} entries={entries}>{mods}</Mods>
    </div>
  );
}

export function IndexPage(
  { children, base, description, path, requestUrl, url }: {
    base: string;
    description?: string;
    path: string;
    requestUrl: URL;
    url: string;
    children: Child<IndexStructure>;
  },
) {
  const indexStructure = take(children);
  const groups: [string, string[]][] = [];
  for (const [key, value] of indexStructure.structure.entries()) {
    if (path === "/" || key.startsWith(path)) {
      groups.push([key, value]);
    }
  }
  const items = groups.map(([key, value]) => (
    <Group
      expanded={groups.length <= 1}
      base={base}
      path={key || "/"}
      isCurrent={path === (key || "/")}
      entries={indexStructure.entries}
    >
      {value}
    </Group>
  ));
  return (
    <div class={gtw("content")}>
      <IndexMeta requestUrl={requestUrl} url={url} description={description} />
      <nav class={gtw("leftNav")}>
        <SideBarHeader index>{url}</SideBarHeader>
      </nav>
      <article class={gtw("mainBox")}>
        {path === "/" || groups.length <= 1
          ? undefined
          : <h2 class={gtw("section")}>{path}</h2>}
        <div>{items}</div>
      </article>
    </div>
  );
}
