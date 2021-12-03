/* @jsx h */
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
        <div class="tw-802k6s">
          <p>some markdown here</p>
        </div>
        <div class="text-sm mx-4">
          <div>
            <div>
              <span class="italic">@deprecated</span>
            </div>
            <div class="tw-1faf0jn">
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
