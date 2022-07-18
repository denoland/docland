// Copyright 2021 the Deno authors. All rights reserved. MIT license.

// This is the build script for deploy_doc, which generates JSON files in the
// `/static` directory.

import * as semver from "https://deno.land/x/semver@v1.4.0/mod.ts";
import $ from "https://deno.land/x/dax@0.7.0/mod.ts";
import { colors, doc } from "./deps.ts";
import { getIndexStructure, getPackageVersions } from "./docs.ts";

await Deno.permissions.request({ name: "read", path: "." });
await Deno.permissions.request({ name: "write", path: "./static" });
await Deno.permissions.request({ name: "net" });

interface DenoLibRelease {
  tag: string;
  specifier: string;
  contentType: string;
}

interface GitHubAsset {
  "name": string;
  "content_type": string;
  "browser_download_url": string;
}

interface GitHubRelease {
  "tag_name": string;
  "assets": GitHubAsset[];
}

const gitHubAPIHeaders = {
  accept: "application/vnd.github.v3+json",
} as const;

$.logStep("Building deploy_doc...");

$.logStep("Fetching Deno CLI releases...");

const releases = await $.request(
  "https://api.github.com/repos/denoland/deno/releases?per_page=100",
).header(gitHubAPIHeaders)
  .json<GitHubRelease[]>();
const denoReleases: DenoLibRelease[] = [];
for (const release of releases) {
  for (const asset of release.assets) {
    if (asset.name === "lib.deno.d.ts") {
      denoReleases.push({
        tag: release.tag_name,
        specifier: asset.browser_download_url,
        contentType: asset.content_type,
      });
    }
  }
}

const denoLibs = denoReleases.filter(({ tag }) => {
  return !$.existsSync(`./static/stable_${tag}.json`);
});

if (denoLibs.length) {
  $.logStep("Documenting Deno CLI stable API releases...");
}

for (const { tag, specifier, contentType } of denoLibs) {
  const nodes = await doc(specifier, {
    includeAll: true,
    async load(specifier) {
      const res = await $.request(specifier).noThrow();
      if (res.status === 200) {
        return {
          specifier,
          headers: {
            "content-type": contentType,
          },
          content: await res.text(),
          kind: "module",
        };
      }
    },
  });
  $.logLight(`  writing stable_${tag}.json`);
  await Deno.writeTextFile(
    `./static/stable_${tag}.json`,
    JSON.stringify(nodes),
  );
}

const denoUnstableLibs = denoReleases.filter(({ tag }) => {
  if (semver.gt(semver.coerce(tag)!, "1.2.0")) {
    try {
      const stat = Deno.statSync(`./static/unstable_${tag}.json`);
      return !stat.isFile;
    } catch {
      return true;
    }
  } else {
    return false;
  }
});

if (denoUnstableLibs.length) {
  $.logStep("Documenting Deno CLI unstable API releases...");
}

for (const { tag } of denoUnstableLibs) {
  const nodes = await doc(
    `https://raw.githubusercontent.com/denoland/deno/${tag}/cli/dts/lib.deno.unstable.d.ts`,
    {
      includeAll: true,
      async load(specifier) {
        const res = await $.request(specifier).noThrow();
        if (res.status === 200) {
          return {
            specifier,
            headers: {
              "content-type": "application/typescript",
            },
            content: await res.text(),
            kind: "module",
          };
        }
      },
    },
  );
  $.logLight(`  writing unstable_${tag}.json`);
  await Deno.writeTextFile(
    `./static/unstable_${tag}.json`,
    JSON.stringify(nodes),
  );
}

const latestRelease = await $.request(
  "https://api.github.com/repos/denoland/deno/releases/latest",
).header(gitHubAPIHeaders).json<GitHubRelease>();
const latestTag = latestRelease.tag_name;

$.log(
  `${colors.bold(colors.green("Latest release"))}: ${colors.yellow(latestTag)}`,
);

$.logStep("Documenting latest stable APIs...");

const latestReleaseLibUrl = latestRelease.assets.find((a) =>
  a.name === "lib.deno.d.ts"
)?.browser_download_url;

if (!latestReleaseLibUrl) {
  $.logError("Error cannot determine latest release lib.");
  Deno.exit(1);
}

const builtInDoc = await doc(
  latestReleaseLibUrl,
  {
    includeAll: true,
    async load(specifier) {
      const res = await fetch(specifier);
      if (res.status === 200) {
        return {
          specifier,
          headers: {
            "content-type": "application/typescript",
          },
          content: await res.text(),
          kind: "module",
        };
      }
    },
  },
);
$.logStep("Saving latest stable APIs...");
await Deno.writeTextFile("./static/stable.json", JSON.stringify(builtInDoc));

$.logStep("Documenting latest unstable APIs...");
const unstableDoc = await doc(
  `https://raw.githubusercontent.com/denoland/deno/${latestTag}/cli/dts/lib.deno.unstable.d.ts`,
  { includeAll: true },
);
$.logStep("Saving latest unstable APIs...");
await Deno.writeTextFile("./static/unstable.json", JSON.stringify(unstableDoc));

$.logStep("Documenting lib esnext...");
const libEsnextPromises = [
  "es5",
  "es6",
  "es2015.collection",
  "es2015.core",
  "es2015",
  "es2015.generator",
  "es2015.iterable",
  "es2015.promise",
  "es2015.proxy",
  "es2015.reflect",
  "es2015.symbol",
  "es2015.symbol.wellknown",
  "es2016.array.include",
  "es2016",
  "es2016.full",
  "es2017",
  "es2017.full",
  "es2017.intl",
  "es2017.object",
  "es2017.sharedmemory",
  "es2017.string",
  "es2017.typedarrays",
  "es2018.asyncgenerator",
  "es2018.asynciterable",
  "es2018",
  "es2018.full",
  "es2018.intl",
  "es2018.promise",
  "es2018.regexp",
  "es2019.array",
  "es2019",
  "es2019.full",
  "es2019.object",
  "es2019.string",
  "es2019.symbol",
  "es2020.bigint",
  "es2020",
  "es2020.full",
  "es2020.intl",
  "es2020.promise",
  "es2020.sharedmemory",
  "es2020.string",
  "es2020.symbol.wellknown",
  "es2021",
  "es2021.full",
  "es2021.intl",
  "es2021.promise",
  "es2021.string",
  "es2021.weakref",
  "es2022.array",
  "es2022",
  "es2022.error",
  "es2022.full",
  "es2022.object",
  "es2022.string",
  "esnext.array",
  "esnext",
  "esnext.full",
  "esnext.intl",
].map((lib) =>
  doc(
    `https://raw.githubusercontent.com/denoland/deno/${latestTag}/cli/dts/lib.${lib}.d.ts`,
    { includeAll: true },
  )
);
const esnextDoc = (await Promise.all(libEsnextPromises)).flat();
$.logStep("Saving lib esnext...");
await Deno.writeTextFile("./static/esnext.json", JSON.stringify(esnextDoc));

$.logStep("Documenting lib dom...");
const domPromises = ["dom", "dom.iterable", "dom.asynciterable"].map((lib) =>
  doc(
    `https://raw.githubusercontent.com/denoland/deno/${latestTag}/cli/dts/lib.${lib}.d.ts`,
    { includeAll: true },
  )
);
$.logStep("Saving lib dom...");
const domDoc = (await Promise.all(domPromises)).flat();
await Deno.writeTextFile("./static/dom.json", JSON.stringify(domDoc));

$.logStep("Documenting std libs...");

const stdLibVersions = (await getPackageVersions("std"))?.versions.filter(
  (version) => {
    return !$.existsSync(`./static/std_${version}.json`);
  },
);

if (stdLibVersions && stdLibVersions.length) {
  for (const version of stdLibVersions) {
    $.logStep(`Indexing std lib ${version}...`);
    const indexStructure = await getIndexStructure(
      "https:/",
      "deno.land",
      "std",
      version,
    );
    if (indexStructure) {
      $.logStep(`Saving std lib ${version}...`);
      await Deno.writeTextFile(
        `./static/std_${version}.json`,
        JSON.stringify(indexStructure),
      );
    }
  }
}

if (Deno.args.includes("--create-pr")) {
  await tryCreatePr();
}

$.logStep("Done.");

async function tryCreatePr() {
  // check for local changes
  await $`git add .`;
  const hasLocalChanges = (await $`git status --porcelain`.text()).length > 0;
  if (!hasLocalChanges) {
    $.log("Had no local changes.");
    return;
  }

  // commit and push
  const branchName = `bump_version${latestTag}`;
  const commitMessage = `Updated files for ${latestTag}`;
  await $`git branch ${branchName}`;
  await $`git commit -m ${commitMessage}`;
  $.logStep("Pushing branch...");
  await $`git push -u origin HEAD`;

  // open a PR
  $.logStep("Opening PR...");
  const { createOctoKit, getGitHubRepository } = await import(
    "https://raw.githubusercontent.com/denoland/automation/0.12.0/github_actions.ts"
  );
  const octoKit = createOctoKit();
  const openedPr = await octoKit.request("POST /repos/{owner}/{repo}/pulls", {
    ...getGitHubRepository(),
    base: "main",
    head: branchName,
    draft: false,
    title: `chore: update for ${latestTag}`,
    body: getPrBody(),
  });
  $.log(`Opened PR at ${openedPr.data.url}`);

  function getPrBody() {
    let text = `Bumped versions for ${latestTag}\n\n` +
      `To make edits to this PR:\n` +
      "```shell\n" +
      `git fetch upstream ${branchName} && git checkout -b ${branchName} upstream/${branchName}\n` +
      "```\n";

    const actor = Deno.env.get("GH_WORKFLOW_ACTOR");
    if (actor != null) {
      text += `\ncc @${actor}`;
    }

    return text;
  }
}
