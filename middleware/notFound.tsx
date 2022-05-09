// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { getStyleTag, h, Helmet, renderSSR, Status, tw } from "../deps.ts";
import type { Middleware } from "../deps.ts";
import { sheet } from "../shared.ts";
import { getBody } from "../util.ts";
import { App } from "../components/app.tsx";
import { ErrorBody } from "../components/error.tsx";

export const handleNotFound: Middleware = async (ctx, next) => {
  await next();
  if (ctx.response.status === Status.NotFound) {
    if (ctx.request.accepts("text/html")) {
      sheet.reset();
      const page = renderSSR(
        <App>
          <ErrorBody title="Not Found">
            The requested URL <code>{ctx.request.url.href}</code> was not found.
          </ErrorBody>
        </App>,
      );
      ctx.response.body = getBody(Helmet.SSR(page), getStyleTag(sheet));
    }
  }
};
