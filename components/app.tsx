// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, Helmet, tw } from "../deps.ts";
import { app, nav } from "./styles.ts";

export function App({ children }: { children?: unknown }) {
  return (
    <div class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app}`}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
        <meta
          name="theme-color"
          media={`(prefers-color-scheme: white)`}
          content="white"
        />
        <meta
          name="theme-color"
          media={`(prefers-color-scheme: #111827})`}
          content="black"
        />
      </Helmet>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer
      class={tw`sticky top-full mt-20 max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8`}
    >
      <nav class={tw`-mx-5 -my-2 flex flex-wrap justify-center`}>
        <FooterLink href="https://deno.land/manual">Manual</FooterLink>
        <FooterLink href="/deno/stable">API</FooterLink>
        <FooterLink href="https://deno.land/std">Standard Library</FooterLink>
        <FooterLink href="https://deno.land/x">Third Party Modules</FooterLink>
        <FooterLink href="https://deno.land/benchmarks">Benchmarks</FooterLink>
        <FooterLink href="https://deno.land/artwork">Artwork</FooterLink>
        <FooterLink href="https://deno.com/blog">Blog</FooterLink>
        <FooterLink href="https://status.deno.land/">System Status</FooterLink>
        <FooterLink href="https://github.com/denoland/deno/wiki#companies-interested-in-deno">
          Companies interested in Deno
        </FooterLink>
      </nav>
      <script>
        {`if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");`}
      </script>
    </footer>
  );
}

function Header() {
  return (
    <header
      class={tw`bg-gray-50 border-b border-gray-200 relative py-6 z-10 dark:(bg-gray-800 border-gray-700)`}
    >
      <nav
        class={tw`mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-8 lg:p-0 max-w-screen-lg ${nav}`}
      >
        <a href="/" class={tw`flex items-center`}>
          <Logo />
        </a>
        <input
          type="checkbox"
          id="nav-cb"
          class={`nav-cb ${tw`hidden`}`}
          aria-label="Navigation"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="menu"
        />
        <div class={tw`-mr-2 flex items-center md:hidden`}>
          <label
            for="nav-cb"
            class={tw`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:(text-gray-500 bg-gray-100) focus:(outline-none bg-gray-100 text-gray-500) dark:(text-gray-100 hover:(text-gray-200 bg-gray-900) focus:(outline-none bg-gray-900 text-gray-200))`}
          >
            <svg
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              class={`menu ${tw`h-6 w-6`}`}
            >
              <title>Menu | Deno</title>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              >
              </path>
            </svg>
            <svg
              class={`close ${tw`h-6 w-6 hidden`}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>Close Menu | Deno</title>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              >
              </path>
            </svg>
          </label>
        </div>
        <div
          class={`nav ${tw`md:(flex w-auto) hidden w-screen px-2 pt-4 pb-3`}`}
        >
          <NavLink href="https://deno.com/deploy">Deploy</NavLink>
          <NavLink href="https://deno.land/manual">Manual</NavLink>
          <NavLink href="https://deno.com/blog">Blog</NavLink>
          <NavLink href="/deno/stable">API</NavLink>
          <NavLink href="https://deno.land/std">Standard Library</NavLink>
          <NavLink href="https://deno.land/x">Third Party Modules</NavLink>
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class={tw`h-10 w-auto sm:h-12 my-2`}
      viewBox="0 0 512 512"
    >
      <title>Deno logo</title>
      <mask id="a">
        <circle fill="white" cx="256" cy="256" r="230"></circle>
      </mask>
      <circle cx="256" cy="256" r="256"></circle>
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
        stroke="black"
        stroke-width="12"
        d="M252.225 344.418c-86.65 2.61-144.576-34.5-144.576-94.363 0-61.494 60.33-111.145 138.351-111.145 37.683 0 69.532 10.65 94.392 30.092 21.882 17.113 37.521 40.526 45.519 66.312 2.574 8.301 22.863 83.767 61.112 227.295l1.295 4.86-159.793 74.443-1.101-8.063c-8.85-64.778-16.546-113.338-23.076-145.634-3.237-16.004-6.178-27.96-8.79-35.794-1.227-3.682-2.355-6.361-3.303-7.952a12.56 12.56 0 00-.03-.05z"
      >
      </path>
      <circle mask="url(#a)" cx="262" cy="203" r="16"></circle>
    </svg>
  );
}

const NavLink = ({ children, href }: { children?: unknown; href: string }) => (
  <a
    class={tw`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:(text-gray-900 bg-gray-50) focus:(outline-none text-gray-900 bg-gray-50) md:(inline-block font-medium text-gray-500) dark:(text-gray-200 hover:(text-gray-50 bg-gray-900) focus:(text-gray-50 bg-gray-900) md:(text-gray-400))`}
    href={href}
  >
    {children}
  </a>
);

const FooterLink = ({
  children,
  href,
}: {
  children?: unknown;
  href: string;
}) => (
  <div class={tw`p-2`}>
    <a
      class={tw`text-base leading-6 text-gray-500 hover:text-gray-900 dark:(text-gray-400 hover:text-gray-50)`}
      href={href}
    >
      {children}
    </a>
  </div>
);
