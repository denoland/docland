// Copyright 2021 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { doc, h, renderSSR } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet } from "../shared.ts";
import { assert } from "../util.ts";

import { asCollection, DocWithLink } from "./common.tsx";

Deno.test({
  name: "asCollection - flattens namespaces",
  async fn() {
    const load = (specifier: string) =>
      Promise.resolve({
        specifier,
        content: `export namespace A {
        export var a: string;
      }
      
      export const a: string;`,
      });
    const entries = await doc("file:///a.ts", { load });
    const actual = asCollection(entries);
    assertEquals(actual.variable?.length, 2);
    assertEquals(actual.variable?.map(([label]) => label), ["A.a", "a"]);
  },
});

Deno.test({
  name: "asCollection - handles deeper namespaces",
  async fn() {
    const load = (specifier: string) =>
      Promise.resolve({
        specifier,
        content: `export namespace A {
        export var a: string;

        export namespace B {
          export var b: string;
        }
      }`,
      });
    const entries = await doc("file:///a.ts", { load });
    const ns = entries[0];
    assert(ns.kind === "namespace");
    const actual = asCollection(ns.namespaceDef.elements, "A");
    assertEquals(actual.variable?.length, 2);
    assertEquals(actual.variable?.map(([label]) => label), ["A.a", "A.B.b"]);
  },
});

Deno.test({
  name: "DocWithLink",
  fn() {
    const Expected = (
      { children, href }: { children: unknown; href: string },
    ) => (
      <div class="flex justify-between">
        <div class="overflow-auto font-mono break-words">{children}</div>
        <a
          href={href}
          target="_blank"
          class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
        >
          [src]
        </a>
      </div>
    );
    sheet.reset();
    const location = {
      filename:
        "https://github.com/denoland/deno/releases/download/v1.0.0/lib.deno.d.ts",
      line: 0,
      col: 0,
    };
    let actual = renderSSR(
      <DocWithLink location={location}>test</DocWithLink>,
    )
      .replaceAll("\n", "");
    let expected = renderSSR(
      <Expected href="https://doc-proxy.deno.dev/builtin/v1.0.0#L0">
        test
      </Expected>,
    ).replaceAll(
      "\n",
      "",
    );
    assertEquals(actual, expected);

    location.filename =
      "https://raw.githubusercontent.com/denoland/deno/v1.0.0/cli/dts/lib.d.ts";
    actual = renderSSR(<DocWithLink location={location}>test</DocWithLink>);
    expected = renderSSR(
      <Expected href="https://github.com/denoland/deno/blob/v1.0.0/cli/dts/lib.d.ts#L0">
        test
      </Expected>,
    );
    assertEquals(actual, expected);
  },
});
