// Copyright 2021 the Deno authors. All rights reserved. MIT license.

// Provide more structured JSX types than nano_jsx provides as well as provide
// URLPattern which is not currently in the DOM lib for TypeScript but supported
// by Deno and Deploy.
import type {} from "./types.d.ts";

// std library colors are used in logging to the console
export * as colors from "https://deno.land/std@0.133.0/fmt/colors.ts";

// WASM bindings to the comrak markdown rendering library
export * as comrak from "https://deno.land/x/comrak@0.1.1/mod.ts";

// WASM bindings to swc/deno_graph/deno_doc which generates the documentation
// structures
export {
  doc,
  type DocOptions,
  type LoadResponse,
} from "https://deno.land/x/deno_doc@v0.33.0/mod.ts";
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
} from "https://deno.land/x/deno_doc@v0.32.0/lib/types.d.ts";

// Used to report measurements to Google Analytics
export { createReportMiddleware } from "https://deno.land/x/g_a@0.1.2/mod.ts";

// Used to convert lowlight trees to HTML
export { toHtml } from "https://esm.sh/hast-util-to-html@8.0.3?pin=v74";

// Used to sanitize some output, ensuring html entities are encoded.
export * as htmlEntities from "https://esm.sh/html-entities@2.3.2?pin=v74";

// Used to do SSR of code block highlighting
export { lowlight } from "https://esm.sh/lowlight@2.4.1?pin=v74";

// Used when overriding proxies content types when serving up static content
export { lookup } from "https://deno.land/x/media_types@v2.12.3/mod.ts";

// Importing the parts of NanoJSX which we are using in the application.
export { Helmet } from "https://deno.land/x/nano_jsx@v0.0.30/components/helmet.ts";
export { h } from "https://deno.land/x/nano_jsx@v0.0.30/core.ts";
export { Fragment } from "https://deno.land/x/nano_jsx@v0.0.30/fragment.ts";
export { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.30/ssr.ts";
export { Store } from "https://deno.land/x/nano_jsx@v0.0.30/store.ts";
export {
  getState,
  setState,
} from "https://deno.land/x/nano_jsx@v0.0.30/hooks/useState.ts";

// The middleware server used to provide the application
export {
  Application,
  type Context,
  HttpError,
  type Middleware,
  type RouteParams,
  Router,
  type RouterContext,
  type RouterMiddleware,
  Status,
  STATUS_TEXT,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";

// resvg WASM bindings that allow conversion of an SVG to a PNG. Open graph and
// twitter do not support SVGs for card images.
export { render } from "https://deno.land/x/resvg_wasm@0.1.0/mod.ts";

// Used to strip markdown when adding to a card image.
export { default as removeMarkdown } from "https://esm.sh/remove-markdown@v0.3.0?pin=v74";

// twind provides server side rendered CSS leveraging tailwind functional
// classes.
export {
  apply,
  type CSSRules,
  type Directive,
  setup,
  tw,
} from "https://esm.sh/twind@0.16.16?pin=v74";
export { css } from "https://esm.sh/twind@0.16.16/css?pin=v74";
export {
  getStyleTag,
  virtualSheet,
} from "https://esm.sh/twind@0.16.16/sheets?pin=v74";
export * as twColors from "https://esm.sh/twind@0.16.16/colors?pin=v74";
