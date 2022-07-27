// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, tw } from "../deps.ts";
import { gtw } from "./styles.ts";

interface DocLinksProps {
  children: string[];
}

function DocLinks({ children }: DocLinksProps) {
  const links = children.map((child) => (
    <li>
      <a class={gtw("link")} href={`/${child}`}>
        <code
          innerHTML={{
            __dangerousHtml: child.replaceAll(/(\/|\?|\.)/g, "$1&#8203;"),
          }}
        />
      </a>
    </li>
  ));
  return <ul class={gtw("list")}>{links}</ul>;
}

export function SpecifierForm() {
  return (
    <main class={gtw("main")}>
      <h1 class={gtw("mainHeader")}>Deno Doc</h1>
      <div
        class={tw`py-6 md:(col-span-3 py-12)`}
      >
        <div class={tw`space-y-4`}>
          <p>
            <a href="/deno/stable" class={gtw("formButton")}>
              Deno CLI APIs (Stable)
            </a>
          </p>
          <p>
            <a href="/deno/unstable" class={gtw("formButton")}>
              Deno CLI APIs (<code>--unstable</code>)
            </a>
          </p>
          <p>
            <a href="/https://deno.land/std/" class={gtw("formButton")}>
              Deno <code>std</code> library
            </a>
          </p>
        </div>
        <div class={tw`text-center my-6`}>or view documentation for</div>
        <div>
          <form
            class={tw`relative text-gray(500 focus-within:700 dark:focus-within:(300)) sm:col-span-6`}
            action="/doc"
            method="get"
          >
            <label
              for="url"
              class={tw`absolute z-10 ml-4 mt-0.5 px-1.5 tracking-wider bg(white dark:gray-800) text-gray-400 font-medium text-sm transition rounded-t-md`}
            >
              URL to Document
            </label>
            <div class={tw`pt-3 w-full`}>
              <div
                class={tw`relative border border-gray(300 focus-within:500 dark:(600 focus-within:400)) rounded-xl overflow-hidden transition flex`}
              >
                <input
                  id="url"
                  name="url"
                  type="url"
                  required
                  class={tw`w-full outline-none px-6 py-4 bg(white dark:gray-800) text-gray(800 focus:900 dark:(100 focus:50))`}
                  label="URL to Document"
                />
              </div>
            </div>
            <div class={tw`absolute right-2 bottom-2 hidden lg:block`}>
              <button class={gtw("insideButton")} type="submit">
                Document
              </button>
            </div>
          </form>
        </div>
        <div class={tw`space-y-6 mt-8`}>
          <p>
            Some samples of documentation:
            <DocLinks>
              {"https://deno.land/x/oak/mod.ts"}
              {"https://deno.land/x/deno_dom/"}
              {"https://deno.land/x/redis/mod.ts"}
              {"https://deno.land/x/amqp/mod.ts"}
              {"https://esm.sh/@firebase/firestore"}
              {"https://esm.sh/@supabase/supabase-js"}
              {"https://esm.sh/preact"}
              {"https://deno.land/x/nano_jsx/"}
            </DocLinks>
          </p>
        </div>
        <div class={tw`mt-16 space-y-6`}>
          <h2 class={tw`text-2xl lg:text-3xl font-bold`}>About</h2>
          <p>
            The source for this web application is available at{" "}
            <a
              class={gtw("url")}
              href="https://github.com/denoland/docland"
              target="_blank"
              rel="noopener"
            >
              github.com/denoland/docland
            </a>.
          </p>
          <p>
            It can also be{" "}
            <a
              class={tw`transition focus-visible:ring-2 focus-visible:ring-black focus:outline-none my-1 py-2 px-2.5 text-base text-gray(600 dark:200) border border-gray-300 rounded-xl hover:shadow h-full`}
              href={`https://dash.deno.com/new?url=${
                encodeURIComponent(
                  "https://raw.githubusercontent.com/denoland/docland/main/main.ts",
                )
              }`}
              target="_blank"
              rel="noopener"
            >
              Deployed...
            </a>{" "}
            into its own deployment as well.
          </p>
        </div>
      </div>
    </main>
  );
}
