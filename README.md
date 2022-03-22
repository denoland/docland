# docland

[![Build Status - Cirrus][]][Build status] [![Twitter handle][]][Twitter badge]
[![Discord Chat](https://img.shields.io/discord/684898665143206084?logo=discord&style=social)](https://discord.gg/deno)

A Deno CLI/Deploy server application which generates documentation for arbitrary
JavaScript and TypeScript modules.

## Overview

When a documentation page is requested, the following occurs at a high level:

- The request URL is processed by the oak router, matching the URL to the route
  patterns.
- When it is matched to a documentation page, the middleware checks to see if
  the documentation JSON structure is in memory.
- If the module isn't in memory, the middleware will attempt to generate the
  documentation JSON structure.
- It calls the `doc()` function from [`deno_doc`](https://deno.land/x/deno_doc)
  with a custom in memory caching loader function.
- `doc()` uses [`deno_graph`](https://deno.land/x/deno_graph) and
  [swc](https://swc.rs/) to generate the documentation JSON structure.
- Once the structure is generated, it uses
  [Nano JSX](https://nanojsx.github.io/) and [twind](https://twind.dev/) to
  server side render a JSX/TSX structure which generates itself based off the
  JSON documentation structure.
- This is then passed back the the requestor.
- If the URL matched is a "card" image, this is server side rendered as a
  JSX/TSX SVG which is then rendered as a PNG using
  [resvg_wasm](https://deno.land/x/resvg_wasm).

## Starting

To run the server locally:

```
> deno task dev
```

The server will start listening on port `8080`, which will be logged to the
console when ready to accept requests.

If you are deploying on Deploy, the `main.ts` should be the module you deploy.

## Building

In order to speed up displaying the _built-in_ documentation, there is a build
script. This will fetch all the releases from GitHub for the Deno CLI and
rebuild the latest release, plus build any missing versions.

To execute the build script:

```
> deno task build
```

## Contributing

We appreciate your help!

To contribute, please read our
[contributing instructions](https://deno.land/manual/contributing).

This repository includes `.devcontainer` metadata which will allow a development
container to be built which has all the development pre-requisites available to
make contribution easier.

---

Copyright 2021 the Deno Authors. All rights reserved. MIT License.

[Build Status - Cirrus]: https://github.com/denoland/docland/workflows/ci/badge.svg?branch=main&event=push
[Build status]: https://github.com/denoland/docland/actions
[Twitter badge]: https://twitter.com/intent/follow?screen_name=deno_land
[Twitter handle]: https://img.shields.io/twitter/follow/deno_land.svg?style=social&label=Follow
