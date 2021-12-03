import { removeMarkdown } from "./deps.ts";

export function assert(cond: unknown, msg = "Assertion failed"): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
}

/**
 * @param bytes Number of bytes
 * @param si If `true` use metric (SI) unites (powers of 1000). If `false` use
 *           binary (IEC) (powers of 1024). Defaults to `true`.
 * @param dp Number of decimal places to display. Defaults to `1`.
 */
export function humanSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1
  );

  return `${bytes.toFixed(dp)} ${units[u]}`;
}

export function getBody(
  { body, head, footer }: {
    body: string;
    head: HTMLElement[];
    footer: HTMLElement[];
  },
  styles: string,
): string {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${styles}
      ${head.join("\n")}
    </head>
    <body>
      ${body}
      ${footer.join("\n")}
    </body>
  </html>`;
}

export function isEven(n: number) {
  return !(n % 2);
}

export type Child<T> = T | [T];

/** A utility function that inspects a value, and if the value is an array,
 * returns the first element of the array, otherwise returns the value. This is
 * used to deal with the ambiguity around children properties with nano_jsx. */
export function take<T>(value: Child<T>, itemIsArray = false): T {
  if (itemIsArray) {
    return Array.isArray(value) && Array.isArray(value[0]) ? value[0] : // deno-lint-ignore no-explicit-any
      value as any;
  } else {
    return Array.isArray(value) ? value[0] : value;
  }
}

/** Patterns of "registries" which will be parsed to be displayed in a more
 * human readable way. */
const patterns = {
  "deno.land/x": new URLPattern(
    "https://deno.land/x/:pkg([^@/]+){@}?:ver?/:mod*",
  ),
  "deno.land/std": new URLPattern("https://deno.land/std{@}?:ver?/:mod*"),
  "nest.land": new URLPattern("https://x.nest.land/:pkg([^@/]+)@:ver/:mod*"),
  "crux.land": new URLPattern("https://crux.land/:pkg([^@/]+)@:ver"),
  "github.com": new URLPattern(
    "https://raw.githubusercontent.com/:org/:pkg/:ver/:mod*",
  ),
  "gist.github.com": new URLPattern(
    "https://gist.githubusercontent.com/:org/:pkg/raw/:ver/:mod*",
  ),
  "esm.sh": new URLPattern(
    "http{s}?://esm.sh/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
  ),
  "skypack.dev": new URLPattern({
    protocol: "https",
    hostname: "cdn.skypack.dev",
    pathname: "/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
    search: "*",
  }),
  "unpkg.com": new URLPattern(
    "https://unpkg.com/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
  ),
};

interface ParsedURL {
  registry: string;
  org?: string;
  package?: string;
  version?: string;
  module?: string;
}

/** Take a string URL and attempt to pattern match it against a known registry
 * and returned the parsed structure. */
export function parseURL(url: string): ParsedURL | undefined {
  for (const [registry, pattern] of Object.entries(patterns)) {
    const match = pattern.exec(url);
    if (match) {
      let { pathname: { groups: { org, pkg, ver, mod } } } = match;
      if (registry === "gist.github.com") {
        pkg = pkg.substr(0, 7);
        ver = ver.substr(0, 7);
      }
      return {
        registry,
        org: org ? org : undefined,
        package: pkg ? pkg : undefined,
        version: ver ? ver : undefined,
        module: mod ? mod : undefined,
      };
    }
  }
}

/** Clean up markdown text, converting it into something that can be displayed
 * just as "normal" text. */
export function cleanMarkdown(markdown: string): string {
  return removeMarkdown(markdown).split("\n\n").map((l) =>
    l.replaceAll("\n", " ")
  ).join("\n\n");
}
