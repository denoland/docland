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
        <div class="tw-vt15iu">
          <p>some markdown here</p>
        </div>
        <div class="text-sm mx-4">
          <div>
            <div>
              <span class="italic">@deprecated</span>
            </div>
            <div class="tw-oc8r6b">
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
