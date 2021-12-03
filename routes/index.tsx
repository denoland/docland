// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { App } from "../components/app.tsx";
import { SpecifierForm } from "../components/specifier_form.tsx";
import { getStyleTag, h, Helmet, renderSSR } from "../deps.ts";
import type { RouterMiddleware } from "../deps.ts";
import { sheet } from "../shared.ts";
import { getBody } from "../util.ts";

function Meta() {
  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@denoland" />
      <meta name="twitter:creator" content="@denoland" />
      <meta property="og:title" content="Deploy Doc" />
      <meta
        name="og:image"
        content="https://doc-land.deno.dev/static/banner.png"
      />
      <meta
        name="og:image:alt"
        content="a logo of a sauropod in the rain with the text Deno Doc Documentation Generator"
      />
      <meta
        property="og:description"
        content="Dynamically generate documentation for your code. Running on Deno Deploy."
      />
      <meta property="og:type" content="website" />
      <meta
        name="description"
        content="Dynamically generate documentation for your code. Running on Deno Deploy."
      />
    </Helmet>
  );
}

export const indexGet: RouterMiddleware<"/"> = (ctx) => {
  sheet.reset();
  const page = renderSSR(
    <App>
      <Meta />
      <SpecifierForm />
    </App>,
  );
  ctx.response.body = getBody(
    Helmet.SSR(page),
    getStyleTag(sheet),
  );
  ctx.response.type = "html";
};
