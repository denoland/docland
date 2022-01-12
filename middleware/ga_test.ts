// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { createMockContext } from "../deps_test.ts";
import { assert } from "../util.ts";

import { filter } from "./ga.ts";

Deno.test({
  name: "filter - filters noise URLs",
  fn() {
    assert(filter(createMockContext({ ip: "127.0.0.1", path: "/" })));
    assert(
      filter(
        createMockContext({
          ip: "127.0.0.1",
          path: "/https://deno.land/x/g_a/mod.ts",
        }),
      ),
    );
    assert(filter(createMockContext({ ip: "127.0.0.1", path: "/doc" })));
    assert(
      filter(createMockContext({ ip: "127.0.0.1", path: "/deno/stable" })),
    );

    assert(
      !filter(createMockContext({ ip: "127.0.0.1", path: "/manifest.json" })),
    );
    assert(
      !filter(createMockContext({ ip: "127.0.0.1", path: "/static/logo.png" })),
    );
    assert(
      !filter(
        createMockContext({
          ip: "127.0.0.1",
          path: "/img/https://deno.land/x/g_a/mod.ts",
        }),
      ),
    );
  },
});
