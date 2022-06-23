// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { type DocNode, h, Helmet, renderSSR } from "../deps.ts";
import { assertEquals } from "../deps_test.ts";
import { type IndexStructure, SerializeMap } from "../docs.ts";
import { sheet } from "../shared.ts";

import { IndexPage } from "./indexPage.tsx";

function getFixtureIndexStructure(): IndexStructure {
  const structure = new SerializeMap<string[]>(
    [
      ["", ["/mod.ts"]],
      ["/lib", ["/lib/mod.ts"]],
    ],
  );
  const entries = new SerializeMap<DocNode[]>(
    [
      ["/mod.ts", [{
        kind: "moduleDoc",
        jsDoc: { doc: "an example module" },
        name: "",
        location: {
          filename: "https://deno.land/x/tst/mod.ts",
          line: 0,
          col: 0,
        },
        declarationKind: "export",
      }]],
      ["/lib/mod.ts", []],
    ],
  );
  return {
    structure,
    entries,
  };
}

Deno.test({
  name: "IndexPage",
  fn() {
    const indexStructure = getFixtureIndexStructure();
    const Expected = () => (
      <div class="tw-j2pie2">
        <Helmet data-ssr="true" data-placement="head">
          <title>deno.land/x/tst/ | Deno Doc</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@denoland" />
          <meta name="twitter:creator" content="@denoland" />
          <meta name="twitter:title" content="deno.land/x/tst/ | Deno Doc" />
          <meta
            name="twitter:image"
            content="https://doc.deno.land/img/https://deno.land/x/tst/"
          />
          <meta
            name="twitter:image:alt"
            content="rendered description as image"
          />
          <meta name="twitter:description" content="test description" />
          <meta property="og:title" content="deno.land/x/tst/ | Deno Doc" />
          <meta
            property="og:image"
            content="https://doc.deno.land/img/https://deno.land/x/tst/"
          />
          <meta
            property="og:image:alt"
            content="rendered description as image"
          />
          <meta property="og:description" content="test description" />
          <meta property="og:type" content="article" />
          <meta name="description" content="test description" />
        </Helmet>
        <nav class="tw-1rrmr5m">
          <div>
            <h2 class="text-gray-900 dark:text-gray-50 text-xl lg:text-2xl font-bold">
              <a
                href="/https://deno.land/x/tst/"
                class="hover:underline break-all"
              >
                deno.land/x/tst/
              </a>
            </h2>
          </div>
        </nav>
        <article class="tw-baauk4">
          <h2 class="tw-17gss7d"></h2>
          <div>
            <div class="tw-n0dh8j" id="group_">
              <input
                type="checkbox"
                id="id_"
                checked
                class="hidden"
                aria-expanded="false"
                aria-controls="group_"
              />
              <label
                for="id_"
                class="block p-2 border-b border-gray-400 dark:border-gray-600 cursor-pointer"
              >
                <img
                  class="inline rotate-90 dark:filter dark:invert mr-2"
                  height="24"
                  width="24"
                  src="/static/arrow_right.svg"
                />
                <span class="mr-4">
                  <a
                    href="/https://deno.land/x/tst//"
                    class="text-blue-800 dark:text-blue-300 hover:underline"
                  >
                    /
                  </a>
                </span>
                <span class="tw-1xinsej">
                  <p>an example module</p>
                </span>
              </label>
              <table class="m-4">
                <tbody>
                  <tr>
                    <td colSpan={2} class="py-2">
                      <a
                        href="/https://deno.land/x/tst//mod.ts"
                        class="pr-4 text-blue-800 dark:text-blue-300 hover:underline"
                      >
                        /mod.ts
                      </a>
                      <span class="tw-1xinsej">
                        <p>an example module</p>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="tw-n0dh8j" id="group_lib">
              <input
                type="checkbox"
                id="id_lib"
                checked
                class="hidden"
                aria-expanded="false"
                aria-controls="group_lib"
              />
              <label
                for="id_lib"
                class="block p-2 border-b border-gray-400 dark:border-gray-600 cursor-pointer"
              >
                <img
                  class="inline rotate-90 dark:filter dark:invert mr-2"
                  height="24"
                  width="24"
                  src="/static/arrow_right.svg"
                />
                <span class="mr-4">
                  <a
                    href="/https://deno.land/x/tst//lib"
                    class="text-blue-800 dark:text-blue-300 hover:underline"
                  >
                    /lib
                  </a>
                </span>
              </label>
              <table class="m-4">
                <tbody>
                  <tr>
                    <td colSpan={2} class="py-2">
                      <a
                        href="/https://deno.land/x/tst//lib/mod.ts"
                        class="pr-4 text-blue-800 dark:text-blue-300 hover:underline"
                      >
                        /lib/mod.ts
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </div>
    );
    sheet.reset();
    const requestUrl = new URL(
      "https://doc.deno.land/https://deno.land/x/tst/",
    );
    const actual = renderSSR(
      <IndexPage
        base="/https://deno.land/x/tst/"
        description="test description"
        path=""
        requestUrl={requestUrl}
        url="https://deno.land/x/tst/"
      >
        {indexStructure}
      </IndexPage>,
    )
      .replaceAll("\n", "");
    const expected = renderSSR(<Expected />).replaceAll("\n", "");
    assertEquals(actual, expected);
  },
});
