// Copyright 2021 the Deno authors. All rights reserved. MIT license.
import { colors } from "../deps.ts";
import type { Middleware } from "../deps.ts";

export const logging: Middleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${colors.green(ctx.request.method)} ${
      colors.cyan(ctx.request.url.pathname)
    } - ${colors.bold(String(rt))}`,
  );
};

export const timing: Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};
