// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, renderSSR } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet, store } from "../shared.ts";
import type { StoreState } from "../shared.ts";

import { MarkdownBlock } from "./markdown.tsx";

Deno.test({
  name: "Markdown - parsing JSDoc @link tags",
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
      }, {
        kind: "variable",
        name: "A",
        location: {
          filename: "https://deno.land/x/example/mod.ts",
          line: 2,
          col: 0,
        },
        variableDef: {
          kind: "var",
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
      <div class="tw-15havrn">
        <p>
          Some block of test with{" "}
          <a href="/https://deno.land/x/example/mod.ts/~/A.C#C">C.C</a> and{" "}
          <a href="/https://deno.land/x/example/mod.ts/~/A">
            <code>A</code>
          </a>and <a href="https://example.com/">External</a> and{" "}
          <a href="https://example.com/">Just a Space</a>
        </p>
      </div>
    );
    sheet.reset();
    const md = `Some block of test with {@link C.C} and {@linkcode A}
and {@link https://example.com/ | External} and {@link https://example.com/ Just a Space}
`;
    const actual = renderSSR(<MarkdownBlock>{md}</MarkdownBlock>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});
