// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, Helmet } from "../deps.ts";
import { getUrlLabel } from "../shared.ts";
import { cleanMarkdown } from "../util.ts";

export function DocMeta(
  { url, doc, item }: { url: string; doc: string; item?: string },
) {
  const description = cleanMarkdown(doc);
  const href = item ? `${url}${url.endsWith("/") ? "" : "/"}~/${item}` : url;
  const imageUrl = `https://doc-land.deno.dev/img/${href}`;
  const title = item
    ? `Deno Doc - ${getUrlLabel(url)} - ${item}`
    : `Deno Doc - ${getUrlLabel(url)}`;
  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@denoland" />
      <meta name="twitter:creator" content="@denoland" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="rendered description as image" />
      <meta name="twitter:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content="rendered description as image" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta name="description" content={description} />
    </Helmet>
  );
}
