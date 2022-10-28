// Copyright 2021 the Deno authors. All rights reserved. MIT license.

import { assertEquals, assertStringIncludes } from "./deps_test.ts";
import { app } from "./main.ts";
import { assert } from "./util.ts";

let start: Promise<string> | undefined;
let close: AbortController | undefined;

function setup(): Promise<string> {
  if (start) {
    return start;
  }
  let resolve: (value: string | PromiseLike<string>) => void;
  start = new Promise((res) => resolve = res);
  close = new AbortController();
  // deno-lint-ignore no-explicit-any
  function onListen({ secure, hostname, port }: any) {
    app.removeEventListener("listen", onListen);
    const url = `${secure ? "https" : "http"}://${hostname}:${port}/`;
    resolve(url);
  }
  app.addEventListener("listen", onListen);

  app.listen({ signal: close.signal, port: 5001 });

  return start;
}

function teardown() {
  if (!close) {
    return;
  }
  close.abort();
  close = undefined;
}

Deno.test({
  name: "route testing",
  async fn() {
    const server = await setup();

    let res = await fetch(server);
    assertEquals(res.status, 200);
    assertStringIncludes(await res.text(), ">Deno Doc<");

    // validate that badge.svg is available
    res = await fetch(`${server}badge.svg`);
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "image/svg+xml");
    await res.arrayBuffer();

    // doc query URLs are redirected to perm-link of the redirected URL
    res = await fetch(
      `${server}doc?url=${encodeURIComponent("https://esm.sh/preact")}`,
    );
    assertEquals(res.status, 200);
    assert(
      res.url.match(
        /http:\/{2}(0\.){3}0:5001\/https:\/{2}esm\.sh\/v\d{1,3}\/preact@\d+\.\d+\.\d+\/src\/index\.d\.ts/,
      ),
    );
    await res.text();

    teardown();
  },
});
