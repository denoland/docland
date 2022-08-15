// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { App } from "../components/app.tsx";
import { IndexCard, ModuleCard, SymbolCard } from "../components/img.tsx";
import { IndexPage } from "../components/indexPage.tsx";
import { DocPage } from "../components/doc.tsx";
import {
  type DocNodeNamespace,
  getStyleTag,
  h,
  Helmet,
  render,
  renderSSR,
  type RouterContext,
  type RouterMiddleware,
  Status,
} from "../deps.ts";
import {
  checkRedirect,
  getEntries,
  getImportMapSpecifier,
  getIndexStructure,
  getLatest,
  getPackageDescription,
  getStaticIndex,
  type IndexStructure,
  maybeCacheStatic,
} from "../docs.ts";
import { sheet, store } from "../shared.ts";
import { getBody } from "../util.ts";

type DocRoutes =
  | "/:proto(http:/|https:/)/:host/:path*/~/:item+"
  | "/:proto(http:/|https:/)/:host/:path*"
  | "/:proto(deno)/:host"
  | "/:proto(deno)/:host/~/:item+";

type ImgRoutes =
  | "/img/:proto(http:/|https:/)/:host/:path*/~/:item+"
  | "/img/:proto(http:/|https:/)/:host/:path*"
  | "/img/:proto(deno)/:host"
  | "/img/:proto(deno)/:host/~/:item+";

const RE_STD = /^std(?:@([^/]+))?/;
const RE_X_PKG = /^x\/([a-zA-Z0-9-_.]{3,})(?:@([^/]+))?/;

function isPackageHost(host: string): boolean {
  return host.toLowerCase() === "deno.land";
}

/**
 * Return `true` if the index structure has "children" entries that can be
 * displayed as an index, otherwise `false`.
 */
function hasSubEntries(indexStructure: IndexStructure, path: string): boolean {
  return [...indexStructure.entries.keys()].some((key) =>
    key.startsWith(path) && key !== path
  );
}

export const packageGetHead: RouterMiddleware<DocRoutes> = async (
  ctx,
  next,
) => {
  let { proto, host, item, path } = ctx.params;
  let { search } = ctx.request.url;
  if (search.includes("/~/")) {
    [search, item] = search.split("/~/");
  }
  if (!isPackageHost(host) || item || !path) {
    // it can't be an index of a package, just processes other middleware
    return next();
  }
  const url = `${proto}/${host}/${path ?? ""}${search}`;
  let pkg;
  let version;
  const maybeMatchStd = path.match(RE_STD);
  const maybeMatchX = path.match(RE_X_PKG);
  if (maybeMatchStd) {
    pkg = "std";
    [, version] = maybeMatchStd;
    path = path.slice(maybeMatchStd[0].length);
    if (!version) {
      const latest = await getLatest(pkg);
      if (!latest) {
        return next();
      }
      return ctx.response.redirect(
        `/${proto}/${host}/std@${latest}${path}${search}`,
      );
    }
  } else if (maybeMatchX) {
    [, pkg, version] = maybeMatchX;
    path = path.slice(maybeMatchX[0].length);
    if (!version) {
      const latest = await getLatest(pkg);
      if (!latest) {
        return next();
      }
      return ctx.response.redirect(
        `/${proto}/${host}/x/${pkg}@${latest}${path}${search}`,
      );
    }
  }
  if (!pkg || !version) {
    // it is a badly formed URL, which will be caught in other middleware
    return next();
  }
  path = path || "/";

  const indexStructure = pkg === "std"
    ? await getStaticIndex("std", version)
    : await getIndexStructure(
      proto,
      host,
      pkg,
      version,
      path,
    );
  if (indexStructure && hasSubEntries(indexStructure, path)) {
    sheet.reset();
    const base = pkg === "std"
      ? `/${proto}/${host}/std@${version}`
      : `/${proto}/${host}/x/${pkg}@${version}`;
    const description = await getPackageDescription(pkg);
    const page = renderSSR(
      <App>
        <IndexPage
          requestUrl={ctx.request.url}
          url={url}
          base={base}
          path={path}
          description={description}
        >
          {indexStructure}
        </IndexPage>
      </App>,
    );
    ctx.response.body = getBody(
      Helmet.SSR(page),
      getStyleTag(sheet),
    );
    ctx.response.type = "html";
  } else {
    return next();
  }
};

export const pathGetHead = async <R extends DocRoutes>(
  ctx: RouterContext<R>,
) => {
  let { proto, host, item, path } = ctx.params;
  let { search } = ctx.request.url;
  if (search.includes("/~/")) {
    [search, item] = search.split("/~/");
  }
  ctx.assert(proto && host, Status.BadRequest, "Malformed documentation URL");
  const url = `${proto}/${host}/${path ?? ""}${search}`;
  const maybeRedirect = await checkRedirect(url);
  if (maybeRedirect) {
    return ctx.response.redirect(
      item ? `/${maybeRedirect}/~/${item}` : `/${maybeRedirect}`,
    );
  }
  await maybeCacheStatic(url, host);
  let importMap;
  const maybeMatchX = path?.match(RE_X_PKG);
  if (maybeMatchX) {
    const [, module, version] = maybeMatchX;
    importMap = await getImportMapSpecifier(module, version);
  }
  const entries = await getEntries(url, importMap);
  store.setState({ entries, url, includePrivate: proto === "deno" });
  sheet.reset();
  const page = renderSSR(
    <App>
      <DocPage base={ctx.request.url}>{item}</DocPage>
    </App>,
  );
  ctx.response.body = getBody(
    Helmet.SSR(page),
    getStyleTag(sheet),
  );
  ctx.response.type = "html";
};

export const docGet = (ctx: RouterContext<"/doc">) => {
  const url = ctx.request.url.searchParams.get("url");
  ctx.assert(url, Status.BadRequest, "The query property `url` is missing.");
  const item = ctx.request.url.searchParams.get("item");
  if (item) {
    ctx.response.redirect(`/${url}/~/${item}`);
  } else {
    ctx.response.redirect(`/${url}`);
  }
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
  let entries = await getEntries(url);
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

export const imgPackageGet: RouterMiddleware<ImgRoutes> = async (
  ctx,
  next,
) => {
  let { proto, host, item, path } = ctx.params;
  let { search } = ctx.request.url;
  if (search.includes("/~/")) {
    [search, item] = search.split("/~/");
  }
  if (!isPackageHost(host) || item || !path) {
    // it can't be an index of a package, just processes other middleware
    return next();
  }
  const url = `${proto}/${host}/${path ?? ""}${search}`;
  let pkg;
  let version;
  const maybeMatchStd = path.match(RE_STD);
  const maybeMatchX = path.match(RE_X_PKG);
  if (maybeMatchStd) {
    pkg = "std";
    [, version] = maybeMatchStd;
    path = path.slice(maybeMatchStd[0].length);
    if (!version) {
      const latest = await getLatest(pkg);
      if (!latest) {
        return next();
      }
      return ctx.response.redirect(
        `/${proto}/${host}/std@${latest}${path}${search}`,
      );
    }
  } else if (maybeMatchX) {
    [, pkg, version] = maybeMatchX;
    path = path.slice(maybeMatchX[0].length);
    if (!version) {
      const latest = await getLatest(pkg);
      if (!latest) {
        return next();
      }
      return ctx.response.redirect(
        `/${proto}/${host}/x/${pkg}@${latest}${path}${search}`,
      );
    }
  }
  if (!pkg || !version) {
    // it is a badly formed URL, which will be caught in other middleware
    return next();
  }
  path = path || "/";

  const indexStructure = pkg === "std"
    ? await getStaticIndex("std", version)
    : await getIndexStructure(
      proto,
      host,
      pkg,
      version,
      path,
    );
  if (indexStructure && !indexStructure.entries.has(path)) {
    const description = await getPackageDescription(pkg);
    const img = renderSSR(<IndexCard url={url} description={description} />);
    ctx.response.body = render(`<?xml version="1.0" encoding="UTF-8"?>${img}`);
    ctx.response.type = "png";
  } else {
    return next();
  }
};
