// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { App } from "../components/app.tsx";
import { ModuleCard, SymbolCard } from "../components/img.tsx";
import { DocPage } from "../components/doc.tsx";
import {
  colors,
  doc,
  getStyleTag,
  h,
  Helmet,
  render,
  renderSSR,
  Status,
} from "../deps.ts";
import type {
  DocNode,
  DocNodeInterface,
  DocNodeNamespace,
  LoadResponse,
  RouterContext,
} from "../deps.ts";
import { sheet, store } from "../shared.ts";
import { assert, getBody } from "../util.ts";

const MAX_CACHE_SIZE = parseInt(Deno.env.get("MAX_CACHE_SIZE") ?? "", 10) ||
  25_000_000;
const cachedSpecifiers = new Set<string>();
const cachedResources = new Map<string, LoadResponse>();
const cachedEntries = new Map<string, DocNode[]>();
let cacheSize = 0;

console.log(`${colors.yellow("MAX_CACHE_SIZE")}: ${MAX_CACHE_SIZE}`);

function checkCache() {
  if (cacheSize > MAX_CACHE_SIZE) {
    const toEvict: string[] = [];
    for (const specifier of cachedSpecifiers) {
      const loadResponse = cachedResources.get(specifier);
      assert(loadResponse);
      toEvict.push(specifier);
      cacheSize -= loadResponse.content.length;
      if (cacheSize <= MAX_CACHE_SIZE) {
        break;
      }
    }
    console.log(
      ` ${colors.yellow("evicting")}: ${
        colors.bold(`${toEvict.length} specifiers`)
      } from cache`,
    );
    for (const evict of toEvict) {
      cachedResources.delete(evict);
      cachedSpecifiers.delete(evict);
      cachedEntries.delete(evict);
    }
  }
}

let lastLoad = Date.now();

async function load(
  specifier: string,
): Promise<LoadResponse | undefined> {
  const url = new URL(specifier);
  try {
    switch (url.protocol) {
      case "file:": {
        console.error(`local specifier requested: ${specifier}`);
        return undefined;
      }
      case "http:":
      case "https:": {
        if (cachedResources.has(specifier)) {
          cachedSpecifiers.delete(specifier);
          cachedSpecifiers.add(specifier);
          return cachedResources.get(specifier);
        }
        const response = await fetch(String(url), { redirect: "follow" });
        if (response.status !== 200) {
          // ensure that resources are not leaked
          await response.arrayBuffer();
          return undefined;
        }
        const content = await response.text();
        const headers: Record<string, string> = {};
        for (const [key, value] of response.headers) {
          headers[key.toLowerCase()] = value;
        }
        const loadResponse: LoadResponse = {
          specifier: response.url,
          headers,
          content,
        };
        cachedResources.set(specifier, loadResponse);
        cachedSpecifiers.add(specifier);
        cacheSize += content.length;
        queueMicrotask(checkCache);
        lastLoad = Date.now();
        return loadResponse;
      }
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}

function mergeEntries(entries: DocNode[]) {
  const merged: DocNode[] = [];
  const namespaces = new Map<string, DocNodeNamespace>();
  const interfaces = new Map<string, DocNodeInterface>();
  for (const node of entries) {
    if (node.kind === "namespace") {
      const namespace = namespaces.get(node.name);
      if (namespace) {
        namespace.namespaceDef.elements.concat(node.namespaceDef.elements);
        if (!namespace.jsDoc) {
          namespace.jsDoc = node.jsDoc;
        }
      } else {
        namespaces.set(node.name, node);
        merged.push(node);
      }
    } else if (node.kind === "interface") {
      const int = interfaces.get(node.name);
      if (int) {
        int.interfaceDef.callSignatures.concat(
          node.interfaceDef.callSignatures,
        );
        int.interfaceDef.indexSignatures.concat(
          node.interfaceDef.indexSignatures,
        );
        int.interfaceDef.methods.concat(node.interfaceDef.methods);
        int.interfaceDef.properties.concat(node.interfaceDef.properties);
        if (!int.jsDoc) {
          int.jsDoc = node.jsDoc;
        }
      } else {
        interfaces.set(node.name, node);
        merged.push(node);
      }
    } else {
      merged.push(node);
    }
  }
  return merged;
}

function Title({ item, url }: { item?: string | null; url: string }) {
  return <title>Deno Doc - {item ? `${url} — ${item}` : url}</title>;
}

async function getEntries<R extends string>(
  ctx: RouterContext<R>,
  url: string,
): Promise<DocNode[]> {
  let entries = cachedEntries.get(url);
  if (!entries) {
    try {
      const start = Date.now();
      entries = await doc(url, { load });
      const end = Date.now();
      console.log(
        ` ${colors.yellow("graph time")}: ${
          colors.bold(`${lastLoad - start}ms`)
        }`,
      );
      console.log(
        ` ${colors.yellow("doc time")}: ${colors.bold(`${end - lastLoad}ms`)}`,
      );
      entries = mergeEntries(entries);
      cachedEntries.set(url, entries);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("Unable to load specifier")) {
          ctx.throw(Status.NotFound, `The module "${url}" cannot be found.`);
        } else {
          ctx.throw(Status.BadRequest, `Bad request: ${e.message}`);
        }
      } else {
        ctx.throw(Status.InternalServerError, "Unexpected object.");
      }
    }
  }
  return entries;
}

async function process<R extends string>(
  ctx: RouterContext<R>,
  url: string,
  includePrivate: boolean,
  item?: string | null,
) {
  const entries = await getEntries(ctx, url);
  store.setState({ entries, url, includePrivate });
  sheet.reset();
  const page = renderSSR(
    <App>
      <Helmet>
        <Title item={item} url={url} />
      </Helmet>
      <DocPage base={ctx.request.url}>{item}</DocPage>
    </App>,
  );
  ctx.response.body = getBody(
    Helmet.SSR(page),
    getStyleTag(sheet),
  );
  ctx.response.type = "html";
}

const decoder = new TextDecoder();

async function maybeCacheStatic(url: string, host: string) {
  if (url.startsWith("deno") && !cachedEntries.has(url)) {
    try {
      const [lib, version] = host.split("@");
      const data = await Deno.readFile(
        new URL(
          `../static/${lib}${version ? `_${version}` : ""}.json`,
          import.meta.url,
        ),
      );
      const entries = JSON.parse(decoder.decode(data));
      cachedEntries.set(url, entries);
    } catch (e) {
      console.log("error fetchin static");
      console.log(e);
    }
  }
}

export const pathGetHead = async <R extends string>(ctx: RouterContext<R>) => {
  let { proto, host, item, path } = ctx.params;
  let { search } = ctx.request.url;
  if (search.includes("/~/")) {
    [search, item] = search.split("/~/");
  }
  ctx.assert(proto && host, Status.BadRequest, "Malformed documentation URL");
  const url = `${proto}/${host}/${path ?? ""}${search}`;
  await maybeCacheStatic(url, host);
  return process(ctx, url, proto === "deno", item);
};

export const docGet = (ctx: RouterContext<"/doc">) => {
  const url = ctx.request.url.searchParams.get("url");
  ctx.assert(url, Status.BadRequest, "The query property `url` is missing.");
  const item = ctx.request.url.searchParams.get("item");
  return process(ctx, url, false, item);
};

export const imgGet = async <R extends string>(ctx: RouterContext<R>) => {
  let { proto, host, item, path } = ctx.params;
  let { search } = ctx.request.url;
  if (search.includes("/~/")) {
    [search, item] = search.split("/~/");
  }
  ctx.assert(proto && host, Status.BadRequest, "Malformed documentation URL");
  const url = `${proto}/${host}/${path ?? ""}${search}`;
  await maybeCacheStatic(url, host);
  let entries = await getEntries(ctx, url);
  if (item) {
    const path = item.split(".");
    const name = path.pop()!;
    if (path && path.length) {
      for (const name of path) {
        const namespace = entries.find((n) =>
          n.kind === "namespace" && n.name === name
        ) as DocNodeNamespace | undefined;
        if (namespace) {
          entries = namespace.namespaceDef.elements;
        }
      }
    }
    const nodes = entries.filter((e) => e.name === name && e.kind !== "import");
    if (!nodes.length) {
      return ctx.throw(Status.NotFound);
    }
    let jsDoc;
    for (const node of nodes) {
      if (node.jsDoc) {
        jsDoc = node.jsDoc;
        break;
      }
    }
    const img = renderSSR(
      <SymbolCard url={url} item={item} doc={jsDoc?.doc ?? ""} />,
    );
    ctx.response.body = render(`<?xml version="1.0" encoding="UTF-8"?>${img}`);
    ctx.response.type = "png";
  } else {
    const jsDoc = entries.find(({ kind }) => kind === "moduleDoc")?.jsDoc;
    const img = renderSSR(<ModuleCard url={url} doc={jsDoc?.doc ?? ""} />);
    ctx.response.body = render(`<?xml version="1.0" encoding="UTF-8"?>${img}`);
    ctx.response.type = "png";
  }
};
