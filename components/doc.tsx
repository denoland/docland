// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, tw } from "../deps.ts";
import type { DocNode, DocNodeFunction, DocNodeNamespace } from "../deps.ts";
import { getLibWithVersion, store, StoreState } from "../shared.ts";
import { parseURL, take } from "../util.ts";
import type { Child } from "../util.ts";
import { ClassCodeBlock, ClassDoc, ClassToc } from "./classes.tsx";
import {
  asCollection,
  IconLink,
  isAbstract,
  Section,
  TocLink,
} from "./common.tsx";
import type { DocNodeCollection } from "./common.tsx";
import { EnumCodeBlock, EnumDoc, EnumToc } from "./enums.tsx";
import { ErrorMessage } from "./error.tsx";
import { FnCodeBlock, FnDoc } from "./functions.tsx";
import { isDeprecated, JsDoc, Tag } from "./jsdoc.tsx";
import {
  InterfaceCodeBlock,
  InterfaceDoc,
  InterfaceToc,
} from "./interfaces.tsx";
import { DocMeta } from "./meta.tsx";
import { NamespaceDoc, NamespaceToc } from "./namespaces.tsx";
import { gtw, largeMarkdownStyles, largeTagStyles } from "./styles.ts";
import { TypeAliasCodeBlock, TypeAliasDoc, TypeAliasToc } from "./types.tsx";
import { VariableCodeBlock } from "./variables.tsx";

function ModuleToc(
  { children, library = false }: {
    children: Child<DocNodeCollection>;
    library?: boolean;
  },
) {
  const collection = take(children);
  const imports = collection.import
    ? collection.import.map(([, imp]) => <li>{imp.importDef.src}</li>)
    : undefined;
  return (
    <div>
      <h3 class={gtw("tocHeader")}>
        This {library ? "Library" : "Module"}
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
      {imports &&
        (
          <div>
            <h3 class={gtw("tocHeader")}>
              Imports
            </h3>
            <ul>{imports}</ul>
          </div>
        )}
    </div>
  );
}

function DocNodes({ children }: { children: Child<DocNodeCollection> }) {
  const collection = take(children);
  return (
    <div class={gtw("mainBox")}>
      {collection.moduleDoc && (
        <JsDoc style={largeMarkdownStyles}>
          {collection.moduleDoc[0][1].jsDoc}
        </JsDoc>
      )}
      {collection.namespace && (
        <Section title="Namespaces" style="nodeNamespace">
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

function CodeBlock({ children }: { children: Child<DocNode[]> }) {
  const nodes = take(children);
  const elements = [];
  for (const node of nodes) {
    switch (node.kind) {
      case "class":
        elements.push(<ClassCodeBlock>{node}</ClassCodeBlock>);
        break;
      case "enum":
        elements.push(<EnumCodeBlock>{node}</EnumCodeBlock>);
        break;
      case "interface":
        elements.push(<InterfaceCodeBlock>{node}</InterfaceCodeBlock>);
        break;
      case "typeAlias":
        elements.push(<TypeAliasCodeBlock>{node}</TypeAliasCodeBlock>);
        break;
      case "variable":
        elements.push(<VariableCodeBlock>{node}</VariableCodeBlock>);
    }
  }
  const fnNodes = nodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    elements.push(<FnCodeBlock>{fnNodes}</FnCodeBlock>);
  }
  return elements;
}

function Doc(
  { children, path }: { children: Child<DocNode[]>; path: string[] },
) {
  const nodes = take(children);
  const elements = [];
  for (const node of nodes) {
    switch (node.kind) {
      case "class":
        elements.push(<ClassDoc>{node}</ClassDoc>);
        break;
      case "enum":
        elements.push(<EnumDoc>{node}</EnumDoc>);
        break;
      case "interface":
        elements.push(<InterfaceDoc>{node}</InterfaceDoc>);
        break;
      case "namespace":
        elements.push(<NamespaceDoc path={path}>{node}</NamespaceDoc>);
        break;
      case "typeAlias":
        elements.push(<TypeAliasDoc>{node}</TypeAliasDoc>);
        break;
    }
  }
  const fnNodes = nodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    elements.push(<FnDoc>{fnNodes}</FnDoc>);
  }
  return elements;
}

function DocToc({ children }: { children: Child<DocNode[]> }) {
  const nodes = take(children);
  if (!nodes.length) {
    return;
  }
  let node;
  if (nodes.length > 1) {
    // we have a "tuple" of an interface with likely a variable, so we will
    // display the toc for the interface
    if (nodes.length === 2) {
      const maybeNode = nodes.find((n) => n.kind === "interface");
      if (maybeNode) {
        node = maybeNode;
      } else {
        return;
      }
    } else {
      return;
    }
  } else {
    node = nodes[0];
  }
  switch (node.kind) {
    case "class":
      return <ClassToc>{node}</ClassToc>;
    case "enum":
      return <EnumToc>{node}</EnumToc>;
    case "interface":
      return <InterfaceToc>{node}</InterfaceToc>;
    case "namespace":
      return <NamespaceToc>{node}</NamespaceToc>;
    case "typeAlias":
      return <TypeAliasToc>{node}</TypeAliasToc>;
    default:
      return undefined;
  }
}

export function DocPage(
  { children, base }: { children: Child<string | null | undefined>; base: URL },
) {
  const state = store.state as StoreState;
  let { entries, url, includePrivate } = state;
  const collection = asCollection(entries, undefined, includePrivate);
  const library = url.startsWith("deno:");
  const item = take(children);
  if (item) {
    const path = item.split(".");
    const name = path.pop()!;
    if (path && path.length) {
      const namespaces = [];
      for (const name of path) {
        const namespace = entries.find((n) =>
          n.kind === "namespace" && n.name === name
        ) as DocNodeNamespace | undefined;
        if (namespace) {
          namespaces.push(namespace);
          entries = namespace.namespaceDef.elements;
        }
      }
      state.namespaces = namespaces;
      store.setState(state);
    }
    const nodes = entries.filter((e) => e.name === name && e.kind !== "import");
    if (!nodes.length) {
      return (
        <main class={gtw("main")}>
          <h1 class={gtw("mainHeader")}>Deno Doc</h1>
          <ErrorMessage title="Entry not found">
            The document entry named "{item}" was not found in specifier
            "{url}".
          </ErrorMessage>
        </main>
      );
    }
    let jsDoc;
    for (const node of nodes) {
      if (node.jsDoc) {
        jsDoc = node.jsDoc;
        break;
      }
    }
    return (
      <div class={gtw("content")}>
        <DocMeta base={base} url={url} doc={jsDoc?.doc ?? ""} item={item} />
        <nav class={gtw("leftNav")}>
          <SideBarHeader>{url}</SideBarHeader>
          <DocToc>{nodes}</DocToc>
        </nav>
        <article class={gtw("mainBox")}>
          <h1 class={gtw("docTitle")}>{item}</h1>
          {isAbstract(nodes[0])
            ? <Tag style={largeTagStyles} color="yellow">abstract</Tag>
            : undefined}
          {isDeprecated(jsDoc)
            ? <Tag style={largeTagStyles} color="gray">deprecated</Tag>
            : undefined}
          <JsDoc style={largeMarkdownStyles} tags={["deprecated"]} tagsWithDoc>
            {jsDoc}
          </JsDoc>
          <CodeBlock>{nodes}</CodeBlock>
          <Doc path={path}>{nodes}</Doc>
        </article>
      </div>
    );
  } else {
    const jsDoc = entries.find(({ kind }) => kind === "moduleDoc")?.jsDoc;
    return (
      <div class={gtw("content")}>
        <DocMeta base={base} url={url} doc={jsDoc?.doc ?? ""} />
        <nav class={gtw("leftNav")}>
          <SideBarHeader>{url}</SideBarHeader>
          <ModuleToc library={library}>{collection}</ModuleToc>
        </nav>
        <DocNodes>{collection}</DocNodes>
      </div>
    );
  }
}

function SideBarHeader({ children }: { children: Child<string> }) {
  const url = take(children);
  const parsed = parseURL(url);
  const href = `/${url}`;
  if (parsed) {
    const module = parsed.module
      ? parsed.module.replaceAll("/", "&#8203;/")
      : undefined;
    let title = module;
    let subtitle;
    const { org, package: pkg, registry, version } = parsed;
    if (org) {
      if (module) {
        subtitle = `${org}/${pkg}`;
      } else {
        title = `${org}/${pkg}`;
      }
    } else if (pkg) {
      if (module) {
        subtitle = pkg;
      } else {
        title = pkg;
      }
    } else if (registry === "deno.land/std") {
      subtitle = "std";
    }
    return (
      <div>
        <h2 class={tw`text-gray-900 text-xl lg:text-2xl font-bold`}>
          <a href={href} class={tw`hover:underline`}>
            {title}
          </a>
        </h2>
        {subtitle && (
          <h3 class={tw`text-gray-900 dark:text-gray-50 lg:text-xl font-bold`}>
            {subtitle}
          </h3>
        )}
        <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
          Registry
        </h3>
        <p class={tw`truncate`}>{registry}</p>
        {org && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Organization
            </h3>
            <p class={tw`truncate`}>{org}</p>
          </div>
        )}
        {pkg && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Package
            </h3>
            <p class={tw`truncate`}>{pkg}</p>
          </div>
        )}
        {module && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Module
            </h3>
            <p class={tw`truncate`}>{module}</p>
          </div>
        )}
        {version && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Version
            </h3>
            <p class={tw`truncate`}>{version}</p>
          </div>
        )}
        <div>
          <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
            Source
          </h3>
          <p class={tw`truncate`}>
            <a href={url} target="_blank" rel="noopener" class={tw`truncate`}>
              <IconLink />
              {url}
            </a>
          </p>
        </div>
      </div>
    );
  } else {
    const [label, version] = getLibWithVersion(url);
    return (
      <div>
        <h2
          class={tw
            `text-gray-900 dark:text-gray-50 text-xl lg:text-2xl font-bold`}
        >
          <a href={href} class={tw`hover:underline break-all`}>{label}</a>
        </h2>
        {version && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Version
            </h3>
            <p class={tw`truncate`}>{version}</p>
          </div>
        )}
      </div>
    );
  }
}
