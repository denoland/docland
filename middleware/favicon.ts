// Copyright 2021 the Deno authors. All rights reserved. MIT license.
import type { Middleware } from "../deps.ts";

export function createFaviconMW(url: string): Middleware {
  let icon: Uint8Array | undefined;
  return async function favicon(ctx, next) {
    if (ctx.request.url.pathname !== "/favicon.ico") {
      return next();
    }
    if (!icon) {
      const res = await fetch(url);
      if (res.status !== 200) {
        ctx.response.status = 404;
        return;
      }
      icon = new Uint8Array(await res.arrayBuffer());
    }
    ctx.response.body = icon;
    ctx.response.type = "image/x-icon";
    ctx.response.headers.set(
      "expires",
      new Date(Date.now() + 31_436_000_000).toUTCString(),
    );
  };
}
