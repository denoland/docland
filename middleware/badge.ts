// Copyright 2021 the Deno authors. All rights reserved. MIT license.
import type { Middleware } from "../deps.ts";

export function createBadgeMW(): Middleware {
  let badge: Uint8Array | undefined;
  return async function badgeMW(ctx, next) {
    if (ctx.request.url.pathname !== "/badge.svg") {
      return next();
    }
    if (!badge) {
      badge = await Deno.readFile(
        new URL("../static/badge.svg", import.meta.url),
      );
    }
    ctx.response.body = badge;
    ctx.response.type = "image/svg+xml";
    ctx.response.headers.set(
      "expires",
      new Date(Date.now() + 31_436_000_000).toUTCString(),
    );
  };
}
