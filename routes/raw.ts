// Copyright 2021 the Deno authors. All rights reserved. MIT license.

import type { RouterContext } from "../deps.ts";

export const getRaw = async (
  ctx: RouterContext<"/raw/deno/stable/:version">,
) => {
  const acceptsHtml = ctx.request.accepts("text/html");
  const req = await fetch(
    `https://github.com/denoland/deno/releases/download/${ctx.params.version}/lib.deno.d.ts`,
  );
  if (req.status === 200) {
    ctx.response.body = req.body;
    ctx.response.type = acceptsHtml ? "text/plain" : "application/typescript";
  }
  ctx.response.status = req.status;
};
