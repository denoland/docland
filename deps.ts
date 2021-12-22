// Copyright 2021 the Deno authors. All rights reserved. MIT license.

// Provide more structured JSX types than nano_jsx provides as well as provide
// URLPattern which is not currently in the DOM lib for TypeScript but supported
// by Deno and Deploy.
import type {} from "./types.d.ts";

// std library colors are used in logging to the console
export * as colors from "https://deno.land/std@0.118.0/fmt/colors.ts";

// WASM bindings to the comrak markdown rendering library
export * as comrak from "https://deno.land/x/comrak@0.1.1/mod.ts";

// WASM bindings to swc/deno_graph/deno_doc which generates the documentation
// structures
export { doc } from "https://deno.land/x/deno_doc@v0.24.0/mod.ts";
export type {
  DocOptions,
  LoadResponse,
} from "https://deno.land/x/deno_doc@v0.24.0/mod.ts";
export type {
  Accessibility,
  ClassConstructorDef,
  ClassIndexSignatureDef,
  ClassMethodDef,
  ClassPropertyDef,
  DecoratorDef,
  DocNode,
  DocNodeClass,
  DocNodeEnum,
  DocNodeFunction,
  DocNodeImport,
  DocNodeInterface,
  DocNodeKind,
  DocNodeModuleDoc,
  DocNodeNamespace,
  DocNodeTypeAlias,
  DocNodeVariable,
  EnumMemberDef,
  InterfaceCallSignatureDef,
  InterfaceIndexSignatureDef,
  InterfaceMethodDef,
  InterfacePropertyDef,
  JsDoc,
  JsDocTag,
  JsDocTagDoc,
  JsDocTagKind,
  JsDocTagNamed,
  JsDocTagNamedTyped,
  JsDocTagOnly,
  JsDocTagParam,
  JsDocTagReturn,
  JsDocTagTyped,
  LiteralCallSignatureDef,
  LiteralIndexSignatureDef,
  LiteralMethodDef,
  LiteralPropertyDef,
  Location,
  ObjectPatPropAssignDef,
  ObjectPatPropDef,
  ObjectPatPropKeyValueDef,
  ObjectPatPropRestDef,
  ParamArrayDef,
  ParamAssignDef,
  ParamDef,
  ParamIdentifierDef,
  ParamObjectDef,
  ParamRestDef,
  TruePlusMinus,
  TsTypeArrayDef,
  TsTypeConditionalDef,
  TsTypeDef,
  TsTypeDefLiteral,
  TsTypeFnOrConstructorDef,
  TsTypeImportTypeDef,
  TsTypeIndexedAccessDef,
  TsTypeInferDef,
  TsTypeIntersectionDef,
  TsTypeKeywordDef,
  TsTypeMappedDef,
  TsTypeOptionalDef,
  TsTypeParamDef,
  TsTypeParenthesizedDef,
  TsTypeQueryDef,
  TsTypeRestDef,
  TsTypeTupleDef,
  TsTypeTypeLiteralDef,
  TsTypeTypeOperatorDef,
  TsTypeTypePredicateDef,
  TsTypeTypeRefDef,
  TsTypeUnionDef,
} from "https://deno.land/x/deno_doc@v0.24.0/lib/types.d.ts";

// Used to convert lowlight trees to HTML
export { toHtml } from "https://esm.sh/hast-util-to-html@8.0.3?pin=v58";

// Used to do SSR of code block highlignting
export { lowlight } from "https://esm.sh/lowlight@2.4.1?pin=v58";

// Used when overriding proxies content types when serving up static content
export { lookup } from "https://deno.land/x/media_types@v2.11.0/mod.ts";

// Importing the parts of NanoJSX which we are using in the application.
// TODO(@kitsonk) isolate issues with > 0.0.21 and raise with NanoJSX
export { Helmet } from "https://deno.land/x/nano_jsx@v0.0.21/components/helmet.ts";
export { h } from "https://deno.land/x/nano_jsx@v0.0.21/core.ts";
export { Fragment } from "https://deno.land/x/nano_jsx@v0.0.21/fragment.ts";
export { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.21/ssr.ts";
export { Store } from "https://deno.land/x/nano_jsx@v0.0.21/store.ts";
export {
  getState,
  setState,
} from "https://deno.land/x/nano_jsx@v0.0.21/hooks/useState.ts";

// The middleware server used to provide the application
export {
  Application,
  HttpError,
  Router,
  Status,
  STATUS_TEXT,
} from "https://deno.land/x/oak@v10.1.0/mod.ts";
export type {
  Context,
  Middleware,
  RouteParams,
  RouterContext,
  RouterMiddleware,
} from "https://deno.land/x/oak@v10.1.0/mod.ts";

// resvg WASM bindings that allow conversion of an SVG to a PNG. Open graph and
// twitter do not support SVGs for card images.
export { render } from "https://deno.land/x/resvg_wasm@0.1.0/mod.ts";

// Used to sanitize some output, ensuring html entities are encoded.
export * as htmlEntities from "https://cdn.skypack.dev/html-entities@2.3.2?dts";

// Used to strip markdown when adding to a card image.
export { default as removeMarkdown } from "https://cdn.skypack.dev/remove-markdown@v0.3.0?dts";

// twind provides server side rendered CSS leveraging tailwind functional
// classes.
// @deno-types=https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=types/twind.d.ts
export {
  apply,
  setup,
  tw,
} from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind.js";
export type {
  CSSRules,
  Directive,
} from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=types/twind.d.ts";
// @deno-types=https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=types/css/css.d.ts
export {
  css,
} from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind/css.js";
// @deno-types=https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=types/sheets/sheets.d.ts
export {
  getStyleTag,
  virtualSheet,
} from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind/sheets.js";
// @deno-types=https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=types/colors/colors.d.ts
export * as twColors from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind/colors.js";
