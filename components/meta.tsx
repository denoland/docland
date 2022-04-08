// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, Helmet } from "../deps.ts";
import { getUrlLabel } from "../shared.ts";
import { cleanMarkdown, parseURL } from "../util.ts";

function getTitle(url: string, item?: string): string {
  const parsed = parseURL(url);
  if (parsed) {
    const { module, org, package: pkg, version, registry } = parsed;
    const orgPkg = org ? `${org}/${pkg}` : pkg;
    const parts = [];
    if (module) {
      parts.push(module);
    }
    if (orgPkg) {
      parts.push(orgPkg);
    } else if (registry === "deno.land/std") {
      parts.push("std");
    }
    if (version) {
      parts.push(`@${version}`);
    }
    parts.push(registry);
    return `${parts.join(" – ")} | Deno Doc`;
  } else {
    return item
      ? `${getUrlLabel(url)} – ${item} | Deno Doc`
      : `${getUrlLabel(url)} | Deno Doc`;
  }
}

export function DocMeta(
  { base, url, doc, item }: {
    base: URL;
    url: string;
    doc: string;
    item?: string;
  },
) {
  const description = cleanMarkdown(doc);
  const href = item ? `${url}${url.endsWith("/") ? "" : "/"}~/${item}` : url;
  const imageUrl = new URL(`/img/${href}`, base).toString();
  const title = getTitle(url, item);
  return (
    <Helmet>
      <title>{title}</title>
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

export function IndexMeta(
  { requestUrl, url, description }: {
    requestUrl: URL;
    url: string;
    description?: string;
  },
) {
  const imageUrl = new URL(`/img/${url}`, requestUrl).toString();
  const title = getTitle(url);
  return (
    <Helmet>
      <title>{title}</title>
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
