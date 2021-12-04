// Copyright 2021 the Deno authors. All rights reserved. MIT license.

import { assertEquals, assertStringIncludes } from "./deps_test.ts";
import { app } from "./main.ts";

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

  app.listen({ signal: close.signal, port: 5000 });

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

    res = await fetch(`${server}deno/stable`);
    assertEquals(res.status, 200);
    assertStringIncludes(
      await res.text(),
      "<title>Deno Doc - deno/stable/</title>",
    );

    // validate that badge.svg is available
    res = await fetch(`${server}badge.svg`);
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "image/svg+xml");
    await res.arrayBuffer();

    // validate that builtin doc nodes get merged properly
    res = await fetch(`${server}deno/stable/~/Deno.connect`);
    assertEquals(res.status, 200);
    assertStringIncludes(await res.text(), ">Deno.connect<");

    teardown();
  },
});
