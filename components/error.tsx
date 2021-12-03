// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import { gtw } from "./styles.ts";

interface ErrorMessageProps {
  title: string;
  children: unknown;
}

export function ErrorBody(
  { children, title }: { children: unknown; title: string },
) {
  return (
    <main class={gtw("main")}>
      <h1 class={gtw("mainHeader")}>Deno Doc</h1>
      <ErrorMessage title={title}>{children}</ErrorMessage>
    </main>
  );
}

export function ErrorMessage({ children, title }: ErrorMessageProps) {
  return (
    <div class={gtw("error")} role="alert">
      <p class={gtw("bold")}>{title}</p>
      <p>{children}</p>
    </div>
  );
}
