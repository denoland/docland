// Copyright 2021 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, Helmet, renderSSR } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { sheet, store } from "../shared.ts";
import type { StoreState } from "../shared.ts";

import { DocPage, parseUsage, Usage } from "./doc.tsx";

Deno.test({
  name: "DocPage - functions with other",
  fn() {
    const state: StoreState = {
      entries: [{
        kind: "function",
        name: "fn",
        location: {
          filename: "https://example.com/mod.ts",
          line: 1,
          col: 0,
        },
        declarationKind: "export",
        functionDef: {
          params: [],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
      }, {
        kind: "function",
        name: "fn",
        location: {
          filename: "https://example.com/mod.ts",
          line: 2,
          col: 0,
        },
        declarationKind: "export",
        functionDef: {
          params: [],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
      }, {
        kind: "namespace",
        name: "fn",
        location: {
          filename: "https://example.com/mod.ts",
          line: 3,
          col: 0,
        },
        declarationKind: "export",
        namespaceDef: {
          elements: [],
        },
      }],
      namespaces: [],
      url: "https://example.com/mod.ts",
      includePrivate: false,
    };
    store.setState(state);
    const Expected = () => (
      <div class="tw-j2pie2">
        <Helmet>
          <title>example.com/mod.ts – fn | Deno Doc</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@denoland" />
          <meta name="twitter:creator" content="@denoland" />
          <meta
            name="twitter:title"
            content="example.com/mod.ts – fn | Deno Doc"
          />
          <meta
            name="twitter:image"
            content="https://example.com/img/https://example.com/mod.ts/~/fn"
          />
          <meta
            name="twitter:image:alt"
            content="rendered description as image"
          />
          <meta name="twitter:description" content="" />
          <meta
            property="og:title"
            content="example.com/mod.ts – fn | Deno Doc"
          />
          <meta
            property="og:image"
            content="https://example.com/img/https://example.com/mod.ts/~/fn"
          />
          <meta
            property="og:image:alt"
            content="rendered description as image"
          />
          <meta property="og:description" content="" />
          <meta property="og:type" content="article" />
          <meta name="description" content="" />
        </Helmet>
        <nav class="tw-19rse9f">
          <div>
            <h2 class="text-gray-900 dark:text-gray-50 text-xl lg:text-2xl font-bold">
              <a
                href="/https://example.com/mod.ts"
                class="hover:underline break-all"
              >
                example.com/mod.ts
              </a>
            </h2>
          </div>
        </nav>
        <article class="tw-baauk4">
          <h1 class="tw-d0anel">fn</h1>
          <div>
            <div class="tw-1esk77l">
              <pre>
                {`<button class="float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded hover:shadow" type="button" onclick="copyImportStatement()">Copy</button>`}
                <code>
                  <span class="code-keyword">import</span> &#123; fn &#125;{" "}
                  <span class="code-keyword">from</span>{" "}
                  <span class="code-string">"https://example.com/mod.ts"</span>;
                </code>
              </pre>
            </div>
            {`<script>function copyImportStatement() {          navigator.clipboard.writeText(\`import { fn } from "https://example.com/mod.ts";\`);        }</script>`}
          </div>
          <div class="tw-1nkr705">
            <div>
              <span class="tw-18hyoot">function{" "}</span>
              <span class="tw-z19beg">fn</span>();
            </div>
            <div>
              <span class="tw-18hyoot">function{" "}</span>
              <span class="tw-z19beg">fn</span>();
            </div>
          </div>
          <div></div>
          <div class="tw-1owjy05">
            <div class="tw-vfhdfy group" id="overload_0">
              <a
                href="#overload_0"
                class="tw-xn3ar9"
                aria-label="Anchor"
                tabIndex={-1}
              >
                §
              </a>
              <div class="tw-8ej7ai">
                <div class="flex justify-between">
                  <div class="overflow-auto font-mono break-words">fn()</div>
                  <a
                    href="https://example.com/mod.ts#L1"
                    target="_blank"
                    class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
                  >
                    [src]
                  </a>
                </div>
              </div>
            </div>
            <div class="tw-vfhdfy group" id="overload_1">
              <a
                href="#overload_1"
                class="tw-xn3ar9"
                aria-label="Anchor"
                tabIndex={-1}
              >
                §
              </a>
              <div class="tw-8ej7ai">
                <div class="flex justify-between">
                  <div class="overflow-auto font-mono break-words">fn()</div>
                  <a
                    href="https://example.com/mod.ts#L2"
                    target="_blank"
                    class="pl-2 break-words text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
                  >
                    [src]
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
    sheet.reset();
    const base = new URL("https://example.com/mod.ts");
    const actual = renderSSR(<DocPage base={base}>fn</DocPage>)
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Usage component - namespace import",
  fn() {
    const Expected = () => (
      <div>
        <h2 class="tw-17gss7d">Usage</h2>
        <div class="tw-1esk77l">
          <pre>
            {`<button class="float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded hover:shadow" type="button" onclick="copyImportStatement()">Copy</button>`}
            <code>
              <span class="code-keyword">import</span> *{" "}
              <span class="code-keyword">as</span> examplePackage{" "}
              <span class="code-keyword">from</span>{" "}
              <span class="code-string">
                "https://deno.land/x/example_package/mod.ts"
              </span>;
            </code>
          </pre>
        </div>
        {`<script>function copyImportStatement() {          navigator.clipboard.writeText(\`import * as examplePackage from "https://deno.land/x/example_package/mod.ts";\`);        }</script>`}
      </div>
    );
    const actual = renderSSR(
      <Usage>https://deno.land/x/example_package/mod.ts</Usage>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Usage component - named import",
  fn() {
    const Expected = () => (
      <div>
        <div class="tw-1esk77l">
          <pre>
            {`<button class="float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded hover:shadow" type="button" onclick="copyImportStatement()">Copy</button>`}
            <code>
              <span class="code-keyword">import</span> &#123; a &#125;{" "}
              <span class="code-keyword">from</span>{" "}
              <span class="code-string">
                "https://deno.land/x/example_package/mod.ts"
              </span>;
            </code>
          </pre>
        </div>
        {`<script>function copyImportStatement() {          navigator.clipboard.writeText(\`import { a } from "https://deno.land/x/example_package/mod.ts";\`);        }</script>`}
      </div>
    );
    const actual = renderSSR(
      <Usage item="a">https://deno.land/x/example_package/mod.ts</Usage>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Usage component - named type import",
  fn() {
    const Expected = () => (
      <div>
        <div class="tw-1esk77l">
          <pre>
            {`<button class="float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded hover:shadow" type="button" onclick="copyImportStatement()">Copy</button>`}
            <code>
              <span class="code-keyword">import</span>{" "}
              <span class="code-keyword">type{" "}</span>&#123; A &#125;{" "}
              <span class="code-keyword">from</span>{" "}
              <span class="code-string">
                "https://deno.land/x/example_package/mod.ts"
              </span>;
            </code>
          </pre>
        </div>
        {`<script>function copyImportStatement() {          navigator.clipboard.writeText(\`import type { A } from "https://deno.land/x/example_package/mod.ts";\`);        }</script>`}
      </div>
    );
    const actual = renderSSR(
      <Usage item="A" isType>https://deno.land/x/example_package/mod.ts</Usage>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Usage component - named namespace import",
  fn() {
    const Expected = () => (
      <div>
        <div class="tw-1esk77l">
          <pre>
            {`<button class="float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded hover:shadow" type="button" onclick="copyImportStatement()">Copy</button>`}
            <code>
              <span class="code-keyword">import</span> &#123; a &#125;{" "}
              <span class="code-keyword">from</span>{" "}
              <span class="code-string">
                "https://deno.land/x/example_package/mod.ts"
              </span>; <span class="code-keyword">const</span>{" "}
              &#123; b &#125; = a;
            </code>
          </pre>
        </div>
        {`<script>function copyImportStatement() {          navigator.clipboard.writeText(\`import { a } from "https://deno.land/x/example_package/mod.ts";const { b } = a;\`);        }</script>`}
      </div>
    );
    const actual = renderSSR(
      <Usage item="a.b">https://deno.land/x/example_package/mod.ts</Usage>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Usage component - deep named namespace import",
  fn() {
    const Expected = () => (
      <div>
        <div class="tw-1esk77l">
          <pre>
            {`<button class="float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded hover:shadow" type="button" onclick="copyImportStatement()">Copy</button>`}
            <code>
              <span class="code-keyword">import</span> &#123; a &#125;{" "}
              <span class="code-keyword">from</span>{" "}
              <span class="code-string">
                "https://deno.land/x/example_package/mod.ts"
              </span>; <span class="code-keyword">const</span>{" "}
              &#123; c &#125; = a.b;
            </code>
          </pre>
        </div>
        {`<script>function copyImportStatement() {          navigator.clipboard.writeText(\`import { a } from "https://deno.land/x/example_package/mod.ts";const { c } = a.b;\`);        }</script>`}
      </div>
    );
    const actual = renderSSR(
      <Usage item="a.b.c">https://deno.land/x/example_package/mod.ts</Usage>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "parseUsage()",
  fn() {
    assertEquals(
      parseUsage(
        "https://deno.land/x/example_package/mod.ts",
        undefined,
        undefined,
      ),
      {
        importStatement:
          `import * as examplePackage from "https://deno.land/x/example_package/mod.ts";\n`,
        importSymbol: "examplePackage",
        localVar: undefined,
        usageSymbol: undefined,
      },
    );
    assertEquals(
      parseUsage(
        "https://deno.land/x/example_package/mod.ts",
        "a",
        undefined,
      ),
      {
        importStatement:
          `import { a } from "https://deno.land/x/example_package/mod.ts";\n`,
        importSymbol: "a",
        localVar: "a",
        usageSymbol: undefined,
      },
    );
    assertEquals(
      parseUsage(
        "https://deno.land/x/example_package/mod.ts",
        "a.b",
        undefined,
      ),
      {
        importStatement:
          `import { a } from "https://deno.land/x/example_package/mod.ts";\n\nconst { b } = a;\n`,
        importSymbol: "a",
        localVar: "a",
        usageSymbol: "b",
      },
    );
    assertEquals(
      parseUsage(
        "https://deno.land/x/example_package/mod.ts",
        "a.b.c",
        undefined,
      ),
      {
        importStatement:
          `import { a } from "https://deno.land/x/example_package/mod.ts";\n\nconst { c } = a.b;\n`,
        importSymbol: "a",
        localVar: "a.b",
        usageSymbol: "c",
      },
    );
  },
});
