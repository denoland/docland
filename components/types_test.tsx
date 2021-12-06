// Copyright 2021 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, renderSSR } from "../deps.ts";
import type { TsTypeTypeRefDef } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet, store } from "../shared.ts";
import type { StoreState } from "../shared.ts";

import { TypeDef } from "./types.tsx";

Deno.test({
  name: "TypeDef - namespaced peer",
  fn() {
    const state: StoreState = {
      entries: [{
        kind: "variable",
        name: "C",
        location: {
          filename: "https://deno.land/x/example/mod.ts",
          line: 1,
          col: 0,
        },
        variableDef: {
          kind: "const",
        },
        declarationKind: "export",
      }],
      namespaces: [{
        kind: "namespace",
        namespaceDef: {
          elements: [{
            kind: "variable",
            name: "C",
            location: {
              filename: "https://deno.land/x/example/mod.ts",
              line: 3,
              col: 0,
            },
            variableDef: {
              kind: "const",
            },
            declarationKind: "export",
          }],
        },
        name: "A",
        location: {
          filename: "https://deno.land/x/example/mod.ts",
          line: 2,
          col: 0,
        },
        declarationKind: "export",
      }],
      url: "https://deno.land/x/example/mod.ts",
      includePrivate: false,
    };
    store.setState(state);
    const Expected = () => (
      <span>
        <a href="/https://deno.land/x/example/mod.ts/~/A.C" class="tw-1h2u08d">
          C
        </a>
      </span>
    );
    const def: TsTypeTypeRefDef = {
      kind: "typeRef",
      repr: "",
      typeRef: {
        typeName: "C",
      },
    };
    sheet.reset();
    const actual = renderSSR(<TypeDef inline>{def}</TypeDef>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected></Expected>).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});
