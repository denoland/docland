// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import { getState, setState, STYLE_OVERRIDE } from "../shared.ts";
import { take } from "../util.ts";
import { Anchor, DocWithLink, SectionTitle, TocLink } from "./common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { Params } from "./params.tsx";
import { codeBlockStyles, gtw, largeMarkdownStyles } from "./styles.ts";
import { TypeDef, TypeParams, TypeParamsDoc } from "./types.tsx";

let c: String;

if (c) {}