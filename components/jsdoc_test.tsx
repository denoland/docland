// Copyright 2021 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, renderSSR } from "../deps.ts";
import type { JsDocTagDoc } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet } from "../shared.ts";

import { JsDoc } from "./jsdoc.tsx";

Deno.test({
  name: "JsDoc - with tags",
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
        <div class="tw-av9i5b">
          <p>some markdown here</p>
        </div>
        <div class="text-sm mx-4">
          <div>
            <div>
              <span class="italic">@deprecated</span>
            </div>
            <div class="tw-l2v1xe">
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
  name: "JsDoc - with example tags",
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
        <div class="tw-av9i5b">
          <p>some markdown here</p>
        </div>
        <div class="text-sm mx-4">
          <div>
            <div>
              <span class="italic">@example</span>
            </div>
            <div class="tw-l2v1xe">
              <pre>
                <code>
                  <span class="code-keyword">const</span> a ={" "}
                  <span class="code-string">"a"</span>;
                </code>
              </pre>
            </div>
          </div>
          <div>
            <div>
              <span class="italic">@example</span>
            </div>
            <div class="tw-l2v1xe">
              <pre>
                <code>
                  <span class="code-keyword">const</span> b ={" "}
                  <span class="code-string">"b"</span>;
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
