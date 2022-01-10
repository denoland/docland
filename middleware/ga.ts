// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { createReportMiddleware, STATUS_TEXT } from "../deps.ts";

export const ga = createReportMiddleware({
  metaData(ctx) {
    let documentTitle;
    if (!(ctx.response.status >= 200 && ctx.response.status < 300)) {
      documentTitle = STATUS_TEXT.get(ctx.response.status)?.toLowerCase();
    } else if (ctx.request.url.pathname === "/") {
      documentTitle = "homepage";
    } else {
      documentTitle = "docpage";
    }
    return { documentTitle };
  },
});
