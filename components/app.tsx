// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h, tw } from "../deps.ts";
import { gtw } from "./styles.ts";

export function App({ children }: { children?: unknown }) {
  return (
    <div class={gtw("app")}>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer class={tw`flex justify-between items-end p-8 pt-32`}>
      <div class={tw`flex align-center`}>
        <Logo />
        <p class={tw`ml-4 font-bold text-xl`}>Deno</p>
      </div>
      <div class={tw`flex flex-col lg:flex-row gap-x-8 gap-y-6 text-right`}>
        <FooterLink href="https://deno.com/deploy">Deploy</FooterLink>
        <FooterLink href="https://deno.land/manual">Manual</FooterLink>
        <FooterLink href="/deno/stable">Runtime API</FooterLink>
        <FooterLink href="https://deno.land/std">Standard Library</FooterLink>
        <FooterLink href="https://deno.land/x">Third Party Modules</FooterLink>
        <FooterLink href="https://deno.com/blog">Blog</FooterLink>
        <FooterLink href="https://deno.com/company">Company</FooterLink>
      </div>
    </footer>
  );
}

function Header() {
  return (
    <header
      class={tw
        `px(3 lg:14) h(12 lg:20) text-gray-500 flex justify-between items-center`}
    >
      <a class={tw`flex items-center flex-shrink-0`} href="/">
        <Logo />
        <span class={tw`ml-4 text(2xl gray-900) font-bold`}>Deno</span>
      </a>
      <div class={tw`flex items-center gap-6`}>
        <NavLink href="https://deno.land/">CLI</NavLink>
        <NavLink href="https://deno.com/blog">Blog</NavLink>
        <NavLink href="https://deno.com/deploy">Deploy</NavLink>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
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

const NavLink = (
  { children, href }: { children?: unknown; href: string },
) => <a href={href} class={tw`hover:underline`}>{children}</a>;

const FooterLink = (
  { children, href }: { children?: unknown; href: string },
) => <a href={href} class={tw`text-gray-500 hover:underline`}>{children}</a>;
