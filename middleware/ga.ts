// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { createReportMiddleware, STATUS_TEXT } from "../deps.ts";
import type { Context } from "../deps.ts";

export function filter(ctx: Context) {
  const { pathname } = ctx.request.url;
  return (pathname === "/" || pathname === "/doc" ||
    pathname.split("/").length > 2) &&
    !pathname.startsWith("/static/") && !pathname.startsWith("/img/");
}

export function metaData(ctx: Context) {
  let documentTitle;
  if (!(ctx.response.status >= 200 && ctx.response.status < 300)) {
    documentTitle = STATUS_TEXT[ctx.response.status]?.toLowerCase();
  } else if (ctx.request.url.pathname === "/") {
    documentTitle = "homepage";
  } else {
    documentTitle = "docpage";
  }
  return { documentTitle };
}

// deno-lint-ignore no-explicit-any
export const ga: any = createReportMiddleware({ filter, metaData } as any);
