// Copyright 2021 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, renderSSR } from "../deps.ts";
import type { JsDocTagDoc } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet, store } from "../shared.ts";
import type { StoreState } from "../shared.ts";

import { JsDoc, Markdown } from "./jsdoc.tsx";

Deno.test({
  name: "JSDoc - with tags",
  fn() {
    const doc = {
      doc: "some markdown here",
      tags: [{
        kind: "deprecated",
        doc: "some doc",
      } as JsDocTagDoc],
    };
    const Expected = () => (
      <div>
        <div class="tw-15havrn">
          <p>some markdown here</p>
        </div>
        <div class="text-sm mx-4">
          <div>
            <div>
              <span class="italic">@deprecated</span>
            </div>
            <div class="tw-a6shyc">
              <p>some doc</p>
            </div>
          </div>
        </div>
      </div>
    );
    sheet.reset();
    const actual = renderSSR(<JsDoc tags={["deprecated"]}>{doc}</JsDoc>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected></Expected>).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "JSDoc - with example tags",
  fn() {
    const doc = {
      doc: "some markdown here",
      tags: [{
        kind: "example",
        doc: 'const a = "a";\n',
      }, {
        kind: "example",
        doc: '```ts\nconst b = "b";\n```\n',
      }] as JsDocTagDoc[],
    };
    const Expected = () => (
      <div>
        <div class="tw-15havrn">
          <p>some markdown here</p>
        </div>
        <div class="text-sm mx-4">
          <div>
            <div>
              <span class="italic">@example</span>
            </div>
            <div class="tw-a6shyc">
              <pre>
                <code>
                  <span class="code-keyword">const</span> a ={" "}
                  <span
                    class="code-string"
                    innerHTML={{ __dangerousHtml: `"a"` }}
                  />;
                </code>
              </pre>
            </div>
          </div>
          <div>
            <div>
              <span class="italic">@example</span>
            </div>
            <div class="tw-a6shyc">
              <pre>
                <code>
                  <span class="code-keyword">const</span> b ={" "}
                  <span
                    class="code-string"
                    innerHTML={{ __dangerousHtml: `"b"` }}
                  />;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
    sheet.reset();
    const actual = renderSSR(<JsDoc>{doc}</JsDoc>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected></Expected>).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

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
    const actual = renderSSR(<Markdown>{md}</Markdown>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});
