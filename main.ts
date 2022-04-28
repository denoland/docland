#!/usr/bin/env -S deno run --import-map import-map.json --allow-read=. --allow-net --allow-env --allow-hrtime

// Copyright 2021 the Deno authors. All rights reserved. MIT license.

import { Application, colors, HttpError, lookup, Router } from "./deps.ts";
import { createBadgeMW } from "./middleware/badge.ts";
import { handleNotFound } from "./middleware/notFound.tsx";
import { handleErrors } from "./middleware/errors.tsx";
import { createFaviconMW } from "./middleware/favicon.ts";
import { ga } from "./middleware/ga.ts";
import { logging, timing } from "./middleware/logging.ts";
import {
  docGet,
  imgGet,
  imgPackageGet,
  packageGetHead,
  pathGetHead,
} from "./routes/doc.tsx";
import { indexGet } from "./routes/index.tsx";
import { getRaw } from "./routes/raw.ts";

const router = new Router();

// The index, renders "specifier_form"
router.get("/", indexGet);

router.get("/robots.txt", (ctx) => {
  ctx.response.body = `User-agent: *
Disallow: /static/
`;
  ctx.response.type = "text";
  ctx.response.headers.set(
    "expires",
    new Date(Date.now() + 86_400).toUTCString(),
  );
});

router.get("/manifest.json", (ctx) => {
  ctx.response.body = {
    "short_name": "Deno Doc",
    "name": "Deno Doc: Documentation Generator",
    "icons": [
      {
        "src": "/static/logo-vector.svg",
        "type": "image/svg+xml",
        "sizes": "512x512",
      },
      {
        "src": "/static/logo-192.png",
        "type": "image/png",
        "sizes": "192x192",
      },
      {
        "src": "/static/logo-512.png",
        "type": "image/png",
        "sizes": "512x512",
      },
      {
        "src": "/static/maskable_icon.png",
        "type": "image/png",
        "sizes": "1024x1024",
        "purpose": "any maskable",
      },
    ],
    "start_url": "/",
    "background_color": "#f9fafb",
    "display": "minimal-ui",
    "scope": "/",
    "theme_color": "#cffafe",
    "description": "Documentation generation website for Deno",
    "screenshots": [
      {
        "src": "/static/screenshot_1.png",
        "type": "image/png",
        "sizes": "540x720",
      },
      {
        "src": "/static/screenshot_2.png",
        "type": "image/png",
        "sizes": "540x720",
      },
    ],
  };
  ctx.response.type = "json";
  ctx.response.headers.set(
    "expires",
    new Date(Date.now() + 86_400).toUTCString(),
  );
});

router.get("/sw.js", (ctx) => {
  ctx.response.body = `
  self.addEventListener("install", (evt) => {
    evt.waitUntil(
      caches.open("docland").then((cache) => {
        return cache.addAll([
          "/",
          "/deno/stable",
        ]);
      }),
    );
  });
  
  self.addEventListener("fetch", (evt) => {
    evt.respondWith(
      caches.match(evt.request).then((response) => {
        return response ?? fetch(evt.request);
      }),
    );
  });
`;
  ctx.response.type = "application/javascript";
  ctx.response.headers.set(
    "expires",
    new Date(Date.now() + 86_400).toUTCString(),
  );
});

// Serves up the static content
router.get(
  "/static/:path*",
  async (ctx) => {
    const url = new URL(`./static/${ctx.params.path}`, import.meta.url);
    try {
      await Deno.stat(url);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        ctx.response.status = 404;
        ctx.response.body = "Not Found";
        return;
      }
      throw err;
    }
    const resp = await fetch(url);
    ctx.response.type = lookup(url.toString());
    ctx.response.body = resp.body;
    ctx.response.headers.set(
      "expires",
      new Date(Date.now() + 86_400).toUTCString(),
    );
  },
);

// redirects from legacy doc website
router.get("/builtin/stable", (ctx) => ctx.response.redirect("/deno/stable"));
router.get(
  "/builtin/stable@:version",
  (ctx) => ctx.response.redirect(`/deno/stable@${ctx.params.version}`),
);
router.get(
  "/builtin/unstable",
  (ctx) => ctx.response.redirect("/deno/unstable"),
);
router.get(
  "/:proto(http|https)/:host/:path*",
  (ctx) =>
    ctx.response.redirect(
      `/${ctx.params.proto}://${ctx.params.host}/${ctx.params.path}`,
    ),
);

// Proxy raw GitHub deno lib files
router.get("/raw/deno/stable/:version", getRaw);

// The main documentation routes
// The first middleware handles known package registries where indexed are
// provided (currently only `deno.land`) and the second handles everything else
router.get(
  "/:proto(http:/|https:/)/:host/:path*/~/:item+",
  packageGetHead,
  pathGetHead,
);
router.get("/:proto(http:/|https:/)/:host/:path*", packageGetHead, pathGetHead);
router.get("/:proto(deno)/:host", pathGetHead);
router.get("/:proto(deno)/:host/~/:item+", pathGetHead);
router.head(
  "/:proto(http:/|https:/)/:host/:path*/~/:item+",
  packageGetHead,
  pathGetHead,
);
router.head(
  "/:proto(http:/|https:/)/:host/:path*",
  packageGetHead,
  pathGetHead,
);
router.head("/:proto(deno)/:host", pathGetHead);
router.head("/:proto(deno)/:host/~/:item+", pathGetHead);

// The server provides the ability to do a query parameter to identify the URL.
router.get("/doc", docGet);

// "card" image URLs for open graph/twitter
router.get(
  "/img/:proto(http:/|https:/)/:host/:path*/~/:item+",
  imgPackageGet,
  imgGet,
);
router.get("/img/:proto(http:/|https:/)/:host/:path*", imgPackageGet, imgGet);
router.get("/img/:proto(deno)/:host", imgGet);
router.get("/img/:proto(deno)/:host/~/:item+", imgGet);

export const app = new Application();

// Some general processing
app.use(ga);
app.use(logging);
app.use(timing);
app.use(createFaviconMW("https://deno.land/favicon.ico"));
app.use(createBadgeMW());
app.use(handleErrors);
app.use(handleNotFound);

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  ({ secure, hostname, port }) =>
    console.log(
      `${colors.yellow("Listening on")}: ${
        secure ? "https" : "http"
      }://${hostname}:${port}/`,
    ),
);

// logs out information about oak application errors that were not handled by
// the middleware
app.addEventListener("error", (evt) => {
  let msg = `[${colors.red("error")}] `;
  if (evt.error instanceof Error) {
    msg += `${evt.error.name}: ${evt.error.message}`;
  } else {
    msg += Deno.inspect(evt.error);
  }
  if (
    (evt.error instanceof HttpError && evt.error.status >= 400 &&
      evt.error.status <= 499)
  ) {
    if (evt.context) {
      msg += `\n\nrequest:\n  url: ${evt.context.request.url}\n  headers: ${
        Deno.inspect([...evt.context.request.headers])
      }\n`;
    }
  }
  if (evt.error instanceof Error && evt.error.stack) {
    const stack = evt.error.stack.split("\n");
    stack.shift();
    msg += `\n\n${stack.join("\n")}\n`;
  }
  console.error(msg);
});

// we only listen if this is the main module, which allows use to facilitate
// testing by lazily listening within the test harness
if (Deno.env.get("DENO_DEPLOYMENT_ID") || Deno.mainModule === import.meta.url) {
  app.listen({ port: 8080 });
}
