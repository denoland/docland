// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, htmlEntities, removeMarkdown } from "../deps.ts";
import { getLibWithVersion } from "../shared.ts";
import { parseURL } from "../util.ts";

const wrap = (s: string) =>
  s.replace(/(?![^\n]{1,48}$)([^\n]{1,48})\s/g, "$1\n");

/** Renders the Deno the denosaur as an SVG. */
function DenoLogo() {
  return (
    <g id="deno_logo" transform="translate(1022, 455) scale(0.25)">
      <mask id="a">
        <circle fill="white" cx="256" cy="256" r="230"></circle>
      </mask>
      <circle fill="#111827" cx="256" cy="256" r="256"></circle>
      <path
        mask="url(#a)"
        stroke="white"
        stroke-width="25"
        stroke-linecap="round"
        d="M71 319l17-63M107.964 161.095l17-63M36.93 221l17-63M125.964 385l17-63M160.372 486.829l17-63M230 456.329l17-63M206.257 92.587l17-63M326.395 173.004l17-63M452.182 304.693l17-63M409.124 221l17-63M299.027 54.558l17-63M400.624 86.058l17-63"
      >
      </path>
      <path
        mask="url(#a)"
        fill="white"
        stroke="#111827"
        stroke-width="12"
        d="M252.225 344.418c-86.65 2.61-144.576-34.5-144.576-94.363 0-61.494 60.33-111.145 138.351-111.145 37.683 0 69.532 10.65 94.392 30.092 21.882 17.113 37.521 40.526 45.519 66.312 2.574 8.301 22.863 83.767 61.112 227.295l1.295 4.86-159.793 74.443-1.101-8.063c-8.85-64.778-16.546-113.338-23.076-145.634-3.237-16.004-6.178-27.96-8.79-35.794-1.227-3.682-2.355-6.361-3.303-7.952a12.56 12.56 0 00-.03-.05z"
      >
      </path>
      <circle mask="url(#a)" fill="#111827" cx="262" cy="203" r="16"></circle>
    </g>
  );
}

export function ModuleCard({ url, doc }: { url: string; doc: string }) {
  const lines = wrap(
    htmlEntities.encode(removeMarkdown(doc)).split("\n\n").map((l) =>
      l.replaceAll("\n", " ")
    )
      .join(
        "\n\n",
      ),
  ).split("\n").slice(0, 7);
  const parsed = parseURL(url);
  let title;
  let subtitle;
  let link;
  if (parsed) {
    link = url;
    title = parsed.module;
    if (parsed.org) {
      if (title) {
        subtitle = `${parsed.org}/${parsed.package}`;
      } else {
        title = `${parsed.org}/${parsed.package}`;
      }
    } else if (parsed.package) {
      if (title) {
        subtitle = parsed.package;
      } else {
        title = parsed.package;
      }
    } else if (parsed.registry === "deno.land/std") {
      subtitle = "std";
    }
  } else {
    [title, subtitle] = getLibWithVersion(url);
  }
  return (
    <svg
      width="1200px"
      height="630px"
      viewBox="0 0 1200 630"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>module card</title>
      <g
        id="module-card"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <rect fill="#FFFFFF" x="0" y="0" width="1200" height="630"></rect>
        <DenoLogo />
        <text
          id="title"
          font-family="Inter-Bold, Inter, sans-serif"
          font-size="88"
          font-weight="bold"
          fill="#111827"
        >
          <tspan x="60" y="131">{title}</tspan>
        </text>
        <text
          id="subtitle"
          font-family="Inter-Bold, Inter, sans-serif"
          font-size="68"
          font-weight="bold"
          fill="#111827"
        >
          <tspan x="60" y="197">{subtitle}</tspan>
        </text>
        <text
          id="https://deno.land/x/"
          font-family="Inter-Regular, Inter, sans-serif"
          font-size="48"
          font-weight="normal"
          fill="#111827"
        >
          <tspan x="60" y="260">{link}</tspan>
        </text>
        {doc.length
          ? (
            <line
              x1="59.5"
              y1="291.5"
              x2="1149.5"
              y2="291.5"
              id="Line"
              stroke="#111827"
              stroke-width="5"
              stroke-linecap="square"
            >
            </line>
          )
          : undefined}
        <text
          id="module_description"
          fill-rule="nonzero"
          font-family="JetBrains Mono, monospace"
          font-size="32"
          font-weight="normal"
          fill="#111827"
        >
          <tspan x="60" y="346">{lines[0]}</tspan>
          <tspan x="60" y="385">{lines[1]}</tspan>
          <tspan x="60" y="424">{lines[2]}</tspan>
          <tspan x="60" y="463">{lines[3]}</tspan>
          <tspan x="60" y="502">{lines[4]}</tspan>
          <tspan x="60" y="541">{lines[5]}</tspan>
          <tspan x="60" y="580">{lines[6]}</tspan>
        </text>
      </g>
    </svg>
  );
}

export function SymbolCard(
  { url, item, doc }: { url: string; item: string; doc: string },
) {
  const lines = wrap(
    htmlEntities.encode(removeMarkdown(doc)).split("\n\n").map((l) =>
      l.replaceAll("\n", " ")
    ).join(
      "\n\n",
    ),
  ).split("\n").slice(0, 7);
  let link = url;
  if (url.startsWith("deno")) {
    const [label, version] = getLibWithVersion(url);
    link = `${label}${version ? ` @ ${version}` : ""}`;
  }
  return (
    <svg
      width="1200px"
      height="630px"
      viewBox="0 0 1200 630"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>symbol card</title>
      <g
        id="symbol-card"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <rect fill="#FFFFFF" x="0" y="0" width="1200" height="630"></rect>
        <DenoLogo />
        <text
          id="item"
          font-family="Inter-Bold, Inter"
          font-size="88"
          font-weight="bold"
          fill="#111827"
        >
          <tspan x="60" y="131">{item}</tspan>
        </text>
        <text
          id="link"
          font-family="Inter-Regular, Inter"
          font-size="48"
          font-weight="normal"
          fill="#111827"
        >
          <tspan x="60" y="199">{link}</tspan>
        </text>
        {doc.length
          ? (
            <line
              x1="59.5"
              y1="236.5"
              x2="1149.5"
              y2="236.5"
              id="Line"
              stroke="#111827"
              stroke-width="5"
              stroke-linecap="square"
            >
            </line>
          )
          : undefined}
        <text
          id="symbol-description"
          font-family="JetBrains Mono, monospace"
          font-size="32"
          font-weight="normal"
          fill="#111827"
        >
          <tspan x="60" y="311">{lines[0]}</tspan>
          <tspan x="60" y="350">{lines[1]}</tspan>
          <tspan x="60" y="389">{lines[2]}</tspan>
          <tspan x="60" y="428">{lines[3]}</tspan>
          <tspan x="60" y="467">{lines[4]}</tspan>
          <tspan x="60" y="506">{lines[5]}</tspan>
          <tspan x="60" y="545">{lines[6]}</tspan>
          <tspan x="60" y="584">{lines[7]}</tspan>
        </text>
      </g>
    </svg>
  );
}
