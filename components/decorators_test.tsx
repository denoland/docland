// Copyright 2021 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, renderSSR } from "../deps.ts";
import type { DecoratorDef } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet, store } from "../shared.ts";
import type { StoreState } from "../shared.ts";

import { Decorators, DecoratorsDoc, DecoratorsSubDoc } from "./decorators.tsx";

function setup() {
  const state: StoreState = {
    entries: [
      {
        kind: "function",
        name: "a",
        location: {
          filename: "http://example.com/mod.ts",
          line: 3,
          col: 0,
        },
        declarationKind: "export",
        functionDef: {
          params: [],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
      },
      {
        kind: "function",
        name: "b",
        location: {
          filename: "http://example.com/mod.ts",
          line: 3,
          col: 0,
        },
        declarationKind: "export",
        functionDef: {
          params: [],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
      },
    ],
    namespaces: [],
    url: "http://example.com/mod.ts",
    includePrivate: false,
  };
  store.setState(state);
  sheet.reset();
}

Deno.test({
  name: "Decorators",
  fn() {
    setup();
    const Expected = () => (
      <div>
        <div>
          @<span class="tw-1h4nwdw">
            <a href="/http://example.com/mod.ts/~/a" class="tw-1h2u08d">a</a>
          </span>
        </div>
        <div>
          @<span class="tw-1h4nwdw">
            <a href="/http://example.com/mod.ts/~/b" class="tw-1h2u08d">b</a>
          </span>
          <span>(true, "str")</span>
        </div>
      </div>
    );
    const decorators: DecoratorDef[] = [
      {
        name: "a",
        location: {
          filename: "http://example.com/mod.ts",
          line: 0,
          col: 0,
        },
      },
      {
        name: "b",
        args: ["true", '"str"'],
        location: {
          filename: "http://example.com/mod.ts",
          line: 1,
          col: 0,
        },
      },
    ];
    const actual = renderSSR(<Decorators>{decorators}</Decorators>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "DecoratorsDoc",
  fn() {
    setup();
    const Expected = () => (
      <div>
        <h2 class="tw-17gss7d" id="Decorators">
          <a
            href="#Decorators"
            class="tw-xn3ar9"
            aria-label="Anchor"
            tabIndex={-1}
          >
            §
          </a>Decorators
        </h2>
        <div class="tw-vfhdfy group" id="a">
          <a href="#a" class="tw-xn3ar9" aria-label="Anchor" tabIndex={-1}>§</a>
          <div class="tw-8ej7ai">
            <div class="flex justify-between">
              <div class="overflow-auto font-mono break-words">
                <div>
                  @<span class="tw-1h4nwdw">
                    <a href="/http://example.com/mod.ts/~/a" class="tw-1h2u08d">
                      a
                    </a>
                  </span>
                </div>
              </div>
              <a
                href="http://example.com/mod.ts#L0"
                target="_blank"
                class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
              >
                [src]
              </a>
            </div>
          </div>
        </div>
        <div class="tw-vfhdfy group" id="b">
          <a href="#b" class="tw-xn3ar9" aria-label="Anchor" tabIndex={-1}>§</a>
          <div class="tw-8ej7ai">
            <div class="flex justify-between">
              <div class="overflow-auto font-mono break-words">
                <div>
                  @<span class="tw-1h4nwdw">
                    <a href="/http://example.com/mod.ts/~/b" class="tw-1h2u08d">
                      b
                    </a>
                  </span>
                  <span>(true, "str")</span>
                </div>
              </div>
              <a
                href="http://example.com/mod.ts#L1"
                target="_blank"
                class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
              >
                [src]
              </a>
            </div>
          </div>
        </div>
      </div>
    );
    const decorators: DecoratorDef[] = [
      {
        name: "a",
        location: {
          filename: "http://example.com/mod.ts",
          line: 0,
          col: 0,
        },
      },
      {
        name: "b",
        args: ["true", '"str"'],
        location: {
          filename: "http://example.com/mod.ts",
          line: 1,
          col: 0,
        },
      },
    ];
    const actual = renderSSR(<DecoratorsDoc>{decorators}</DecoratorsDoc>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "DecoratorsSubDoc",
  fn() {
    setup();
    const Expected = () => (
      <div>
        <h3 class="tw-zwqnbw" id="method_Decorators">
          <a
            href="#method_Decorators"
            class="tw-xn3ar9"
            aria-label="Anchor"
            tabIndex={-1}
          >
            §
          </a>Decorators
        </h3>
        <div class="tw-v3xi24 group" id="method_decorator_a">
          <a
            href="#method_decorator_a"
            class="tw-xn3ar9"
            aria-label="Anchor"
            tabIndex={-1}
          >
            §
          </a>
          <div class="tw-8ej7ai">
            <div class="flex justify-between">
              <div class="overflow-auto font-mono break-words">
                <div>
                  @<span class="tw-1h4nwdw">
                    <a href="/http://example.com/mod.ts/~/a" class="tw-1h2u08d">
                      a
                    </a>
                  </span>
                </div>
              </div>
              <a
                href="http://example.com/mod.ts#L0"
                target="_blank"
                class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
              >
                [src]
              </a>
            </div>
          </div>
        </div>
        <div class="tw-v3xi24 group" id="method_decorator_b">
          <a
            href="#method_decorator_b"
            class="tw-xn3ar9"
            aria-label="Anchor"
            tabIndex={-1}
          >
            §
          </a>
          <div class="tw-8ej7ai">
            <div class="flex justify-between">
              <div class="overflow-auto font-mono break-words">
                <div>
                  @<span class="tw-1h4nwdw">
                    <a href="/http://example.com/mod.ts/~/b" class="tw-1h2u08d">
                      b
                    </a>
                  </span>
                  <span>(true, "str")</span>
                </div>
              </div>
              <a
                href="http://example.com/mod.ts#L1"
                target="_blank"
                class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
              >
                [src]
              </a>
            </div>
          </div>
        </div>
      </div>
    );
    const decorators: DecoratorDef[] = [
      {
        name: "a",
        location: {
          filename: "http://example.com/mod.ts",
          line: 0,
          col: 0,
        },
      },
      {
        name: "b",
        args: ["true", '"str"'],
        location: {
          filename: "http://example.com/mod.ts",
          line: 1,
          col: 0,
        },
      },
    ];
    const actual = renderSSR(
      <DecoratorsSubDoc id="method">{decorators}</DecoratorsSubDoc>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});
