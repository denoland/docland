// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  colors,
  doc,
  type DocNode,
  type DocNodeInterface,
  type DocNodeNamespace,
  httpErrors,
  type LoadResponse,
} from "./deps.ts";
import { assert } from "./util.ts";

/** An object which represents an "index" of a library/package. */
export interface IndexStructure {
  /** An object that describes the structure of the library, where the key is
   * the containing folder and the value is an array of modules that represent
   * the the "contents" of the folder. */
  structure: SerializeMap<string[]>;
  /** For modules in the structure, any doc node entries available for the
   * module. */
  entries: SerializeMap<DocNode[]>;
}

interface ApiModuleData {
  data: {
    name: string;
    description: string;
    "star_count": number;
  };
}

interface PackageMetaListing {
  path: string;
  size: number;
  type: "file" | "dir";
}

interface PackageMeta {
  "uploaded_at": string;
  "directory_listing": PackageMetaListing[];
  "upload_options": {
    type: string;
    repository: string;
    ref: string;
  };
}

interface PackageVersions {
  latest: string;
  versions: string[];
}

const EXT = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];
const INDEX_MODULES = ["mod", "lib", "main", "index"].flatMap((idx) =>
  EXT.map((ext) => `${idx}${ext}`)
);
const MAX_CACHE_SIZE = parseInt(Deno.env.get("MAX_CACHE_SIZE") ?? "", 10) ||
  25_000_000;
const RE_IGNORED_MODULE =
  /(\/[_.].|(test|.+_test)\.(js|jsx|mjs|cjs|ts|tsx|mts|cts)$)/i;
const RE_MODULE_EXT = /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/i;
const RE_PRIVATE_PATH = /\/([_.].|testdata)/;

const S3_BUCKET =
  "http://deno-registry2-prod-storagebucket-b3a31d16.s3-website-us-east-1.amazonaws.com/";
const DENO_API = "https://api.deno.land/modules/";

class SerializeMap<V> extends Map<string, V> {
  toJSON(): Record<string, V> {
    return Object.fromEntries(this.entries());
  }
}

const cachedSpecifiers = new Set<string>();
const cachedResources = new Map<string, LoadResponse>();
const cachedEntries = new Map<string, DocNode[]>();
let cacheSize = 0;

const cachedIndexes = new Map<string, IndexStructure | undefined>();
const cachedPackageData = new Map<string, ApiModuleData | undefined>();
const cachedPackageMeta = new Map<
  string,
  Map<string, PackageMeta | undefined>
>();
const cachedPackageVersions = new Map<string, PackageVersions | undefined>();

let cacheCheckQueued = false;

/** Check the cache, evicting any cached data using a LRU schema, until the
 * cache is below the threshold. */
function checkCache() {
  if (cacheSize > MAX_CACHE_SIZE) {
    const toEvict: string[] = [];
    for (const specifier of cachedSpecifiers) {
      const loadResponse = cachedResources.get(specifier);
      assert(loadResponse);
      assert(loadResponse.kind === "module");
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
  cacheCheckQueued = false;
}

/** Determine if a given specifier actually resolves to a redirected
 * specifier, caching the load responses */
export async function checkRedirect(
  specifier: string,
): Promise<string | undefined> {
  if (!specifier.startsWith("http")) {
    return undefined;
  }
  const cached = cachedResources.get(specifier);
  let finalSpecifier = specifier;
  if (cached) {
    finalSpecifier = cached.specifier;
  } else {
    try {
      const res = await fetch(specifier, { redirect: "follow" });
      if (res.status !== 200) {
        // ensure that resources are not leaked
        await res.arrayBuffer();
      }
      const content = await res.text();
      const xTypeScriptTypes = res.headers.get("x-typescript-types");
      const headers: Record<string, string> = {};
      for (const [key, value] of res.headers) {
        headers[key.toLowerCase()] = value;
      }
      cachedResources.set(specifier, {
        specifier: res.url,
        kind: "module",
        headers,
        content,
      });
      cachedSpecifiers.add(specifier);
      cacheSize += content.length;
      enqueueCheck();
      finalSpecifier = xTypeScriptTypes
        ? new URL(xTypeScriptTypes, res.url).toString()
        : res.url;
    } catch {
      // just swallow errors
    }
  }
  return specifier === finalSpecifier ? undefined : finalSpecifier;
}

function enqueueCheck() {
  if (!cacheCheckQueued) {
    cacheCheckQueued = true;
    queueMicrotask(checkCache);
  }
}

function getDirs(path: string, packageMeta: PackageMeta) {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  if (isDir(path, packageMeta)) {
    const dirs: string[] = [];
    for (const { path: p, type } of packageMeta.directory_listing) {
      if (
        p.startsWith(path) && type === "dir" &&
        !p.slice(path.length).match(RE_PRIVATE_PATH)
      ) {
        dirs.push(p);
      }
    }
    return dirs;
  }
}

export async function getEntries(url: string): Promise<DocNode[]> {
  let entries = cachedEntries.get(url);
  if (!entries) {
    try {
      entries = mergeEntries(await doc(url, { load }));
      cachedEntries.set(url, entries);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("Unable to load specifier")) {
          throw new httpErrors.NotFound(`The module "${url}" cannot be found`);
        } else {
          throw new httpErrors.BadRequest(`Bad request: ${e.message}`);
        }
      } else {
        throw new httpErrors.InternalServerError("Unexpected object.");
      }
    }
  }
  return entries;
}

function getIndex(dir: string, packageMeta: PackageMeta) {
  const files: string[] = [];
  for (const { path, type } of packageMeta.directory_listing) {
    if (path.startsWith(dir) && type === "file") {
      files.push(path);
    }
  }
  for (const index of INDEX_MODULES) {
    const needle = `${dir}/${index}`;
    const item = files.find((file) => file.toLowerCase() === needle);
    if (item) {
      return item;
    }
  }
}

export async function getLatest(pkg: string): Promise<string | undefined> {
  const packageVersions = await getPackageVersions(pkg);
  return packageVersions?.latest;
}

function getModules(path: string, packageMeta: PackageMeta) {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  if (isDir(path, packageMeta)) {
    const modules: string[] = [];
    for (const { path: p, type } of packageMeta.directory_listing) {
      const slice = p.slice(path.length);
      if (
        p.startsWith(path) && type === "file" && slice.lastIndexOf("/") === 0 &&
        p.match(RE_MODULE_EXT) &&
        !slice.match(RE_IGNORED_MODULE)
      ) {
        modules.push(p);
      }
    }
    if (modules.length) {
      return modules;
    }
  }
}

export async function getPackageDescription(
  pkg: string,
): Promise<string | undefined> {
  if (!cachedPackageData.has(pkg)) {
    const res = await fetch(`${DENO_API}${pkg}`);
    let body: ApiModuleData | undefined;
    if (res.status === 200) {
      body = await res.json();
    }
    cachedPackageData.set(pkg, body);
  }
  return cachedPackageData.get(pkg)?.data.description;
}

async function getPackageMeta(
  pkg: string,
  version: string,
): Promise<PackageMeta | undefined> {
  if (!cachedPackageMeta.has(pkg)) {
    cachedPackageMeta.set(pkg, new Map());
  }
  const versionCache = cachedPackageMeta.get(pkg)!;
  if (!versionCache.get(version)) {
    const res = await fetch(
      `${S3_BUCKET}${pkg}/versions/${version}/meta/meta.json`,
    );
    if (res.status === 200) {
      const packageMeta = await res.json() as PackageMeta;
      versionCache.set(version, packageMeta);
    } else {
      versionCache.set(version, undefined);
    }
  }
  return versionCache.get(version);
}

export async function getPackageVersions(
  pkg: string,
): Promise<PackageVersions | undefined> {
  if (!cachedPackageVersions.has(pkg)) {
    const res = await fetch(`${S3_BUCKET}${pkg}/meta/versions.json`);
    if (res.status === 200) {
      const packageVersions = await res.json() as PackageVersions;
      cachedPackageVersions.set(pkg, packageVersions);
    } else {
      cachedPackageVersions.set(pkg, undefined);
    }
  }
  return cachedPackageVersions.get(pkg);
}

async function getIndexEntries(
  proto: string,
  host: string,
  pkg: string,
  version: string,
  structure: Map<string, string[]>,
): Promise<SerializeMap<DocNode[]>> {
  const indexEntries = new SerializeMap<DocNode[]>();
  for (const mods of structure.values()) {
    for (const mod of mods) {
      const url = pkg === "std"
        ? `${proto}/${host}/std@${version}${mod}`
        : `${proto}/${host}/x/${pkg}@${version}${mod}`;
      try {
        const entries = await getEntries(url);
        if (entries.length) {
          indexEntries.set(mod, entries);
        }
      } catch {
        // we just swallow errors here
      }
    }
  }
  return indexEntries;
}

export async function getIndexStructure(
  proto: string,
  host: string,
  pkg: string,
  version: string,
  path = "/",
): Promise<IndexStructure | undefined> {
  const packageMeta = await getPackageMeta(pkg, version);
  if (packageMeta) {
    const dirs = getDirs(path, packageMeta);
    if (dirs) {
      const structure = new SerializeMap<string[]>();
      for (const dir of dirs) {
        const index = getIndex(dir, packageMeta);
        if (index) {
          structure.set(dir, [index]);
        } else {
          const modules = getModules(dir, packageMeta);
          if (modules) {
            structure.set(dir, modules);
          }
        }
      }
      if (structure.size) {
        const entries = await getIndexEntries(
          proto,
          host,
          pkg,
          version,
          structure,
        );
        if (entries.size) {
          return { structure, entries };
        }
      }
    }
  }
}

function isDir(path: string, packageMeta: PackageMeta) {
  if (path === "") {
    return true;
  }
  for (const { path: p, type } of packageMeta.directory_listing) {
    if (path === p) {
      return type === "dir";
    }
  }
  return false;
}

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
          kind: "module",
          specifier: response.url,
          headers,
          content,
        };
        cachedResources.set(specifier, loadResponse);
        cachedSpecifiers.add(specifier);
        cacheSize += content.length;
        enqueueCheck();
        return loadResponse;
      }
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}

const decoder = new TextDecoder();

export async function maybeCacheStatic(url: string, host: string) {
  if (url.startsWith("deno") && !cachedEntries.has(url)) {
    try {
      const [lib, version] = host.split("@");
      const data = await Deno.readFile(
        new URL(
          `./static/${lib}${version ? `_${version}` : ""}.json`,
          import.meta.url,
        ),
      );
      const entries = mergeEntries(JSON.parse(decoder.decode(data)));
      cachedEntries.set(url, entries);
    } catch (e) {
      console.log("error fetching static");
      console.log(e);
    }
  }
}

export async function getStaticIndex(
  pkg: string,
  version: string,
): Promise<IndexStructure | undefined> {
  const key = `${pkg}_${version}`;
  if (!cachedIndexes.has(key)) {
    try {
      const data = await Deno.readFile(
        new URL(`./static/${key}.json`, import.meta.url),
      );
      const index = JSON.parse(decoder.decode(data), (key, value) => {
        if (
          typeof value === "object" &&
          (key === "structure" || key === "entries")
        ) {
          return new SerializeMap(Object.entries(value));
        } else {
          return value;
        }
      }) as IndexStructure;
      cachedIndexes.set(key, index);
    } catch {
      // just swallow errors here
    }
  }
  return cachedIndexes.get(key);
}

function mergeEntries(entries: DocNode[]) {
  const merged: DocNode[] = [];
  const namespaces = new Map<string, DocNodeNamespace>();
  const interfaces = new Map<string, DocNodeInterface>();
  for (const node of entries) {
    if (node.kind === "namespace") {
      const namespace = namespaces.get(node.name);
      if (namespace) {
        namespace.namespaceDef.elements.push(...node.namespaceDef.elements);
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
        int.interfaceDef.callSignatures.push(
          ...node.interfaceDef.callSignatures,
        );
        int.interfaceDef.indexSignatures.push(
          ...node.interfaceDef.indexSignatures,
        );
        int.interfaceDef.methods.push(...node.interfaceDef.methods);
        int.interfaceDef.properties.push(...node.interfaceDef.properties);
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
