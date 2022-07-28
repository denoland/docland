// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.
/** @jsx h */

import { h, tw } from "../deps.ts";
import { getLibWithVersion } from "../shared.ts";
import { type Child, parseURL, take } from "../util.ts";
import { IconLink } from "./common.tsx";

export function SideBarHeader(
  { children, index = false }: { children: Child<string>; index?: boolean },
) {
  const url = take(children);
  const parsed = parseURL(url);
  const href = `/${url}`;
  if (parsed) {
    const module = parsed.module
      ? parsed.module.replaceAll("/", "&#8203;/")
      : undefined;
    let title = `/${module ?? ""}`;
    let subtitle;
    const { org, package: pkg, registry, version } = parsed;
    if (org) {
      if (module) {
        subtitle = `${org}/${pkg}`;
      } else {
        title = `${org}/${pkg}`;
      }
    } else if (pkg) {
      if (module || index) {
        subtitle = pkg;
      } else {
        title = pkg;
      }
    } else if (registry === "deno.land/std") {
      subtitle = "std";
    }
    return (
      <div>
        <h2 class={tw`text-gray(900 dark:50) text-xl lg:text-2xl font-bold`}>
          <a
            href={href}
            class={tw`hover:underline`}
            innerHTML={{ __dangerousHtml: title }}
          />
        </h2>
        {subtitle && (
          <h3 class={tw`text-gray(900 dark:50) lg:text-xl font-bold`}>
            {subtitle}
          </h3>
        )}
        <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
          Registry
        </h3>
        <p class={tw`truncate`}>{registry}</p>
        {org && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Organization
            </h3>
            <p class={tw`truncate`}>{org}</p>
          </div>
        )}
        {pkg && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Package
            </h3>
            <p class={tw`truncate`}>{pkg}</p>
          </div>
        )}
        {index
          ? (
            <div>
              <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
                Path
              </h3>
              <p
                class={tw`truncate`}
                innerHTML={{ __dangerousHtml: `/${module ?? ""}` }}
              />
            </div>
          )
          : module && (
            <div>
              <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
                Module
              </h3>
              <p class={tw`truncate`} innerHTML={{ __dangerousHtml: module }} />
            </div>
          )}
        {version && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Version
            </h3>
            <p class={tw`truncate`}>{version}</p>
          </div>
        )}
        <div>
          <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
            Source
          </h3>
          <p class={tw`truncate`}>
            <a href={url} target="_blank" rel="noopener" class={tw`truncate`}>
              <IconLink />
              {url}
            </a>
          </p>
        </div>
      </div>
    );
  } else {
    const [label, version] = getLibWithVersion(url);
    return (
      <div>
        <h2
          class={tw`text-gray-900 dark:text-gray-50 text-xl lg:text-2xl font-bold`}
        >
          <a href={href} class={tw`hover:underline break-all`}>{label}</a>
        </h2>
        {version && (
          <div>
            <h3 class={tw`text-gray-600 dark:text-gray-400 text-sm mt-2`}>
              Version
            </h3>
            <p class={tw`truncate`}>{version}</p>
          </div>
        )}
      </div>
    );
  }
}
