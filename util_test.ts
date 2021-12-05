// Copyright 2021 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "./deps_test.ts";
import { assert, parseURL } from "./util.ts";

Deno.test({
  name: "parseURL() - github raw URLs",
  fn() {
    const actual = parseURL(
      "https://github.com/denoland/deno_std/raw/main/http/mod.ts",
    );
    assert(actual);
    assertEquals(actual, {
      registry: "github.com",
      org: "denoland",
      package: "deno_std",
      version: "main",
      module: "http/mod.ts",
    });
  },
});

Deno.test({
  name: "parseURL() - esm CDN urls",
  fn() {
    const actual = parseURL(
      "https://cdn.esm.sh/v58/firebase@9.4.1/database/dist/database/index.d.ts",
    );
    assert(actual);
    assertEquals(actual, {
      registry: "esm.sh @ v58",
      org: undefined,
      package: "firebase",
      version: "9.4.1",
      module: "database/dist/database/index.d.ts",
    });
  },
});
