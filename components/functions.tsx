// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import type {
  DocNodeFunction,
  JsDoc as JsDocNode,
  Location,
  TsTypeDef,
} from "../deps.ts";
import { getState, setState, STYLE_OVERRIDE } from "../shared.ts";
import { Anchor, DocWithLink, SubSectionTitle } from "./common.tsx";
import { getReturnDoc, JsDoc, Markdown } from "./jsdoc.tsx";
import { Params, ParamsSubDoc } from "./params.tsx";
import { codeBlockStyles, gtw, largeMarkdownStyles } from "./styles.ts";
import { TypeDef, TypeParams, TypeParamsSubDoc } from "./types.tsx";
import { take } from "../util.ts";
import type { Child } from "../util.ts";

export function FnCodeBlock(
  { children }: { children: Child<DocNodeFunction[]> },
) {
  const fns = take(children);
  const prev = getState(STYLE_OVERRIDE);
  setState(STYLE_OVERRIDE, codeBlockStyles);
  const keyword = gtw("keyword", codeBlockStyles);
  const fnName = gtw("fnName", codeBlockStyles);
  const items = fns.map((
    {
      name,
      functionDef: { isAsync, isGenerator, typeParams, params, returnType },
    },
  ) => (
    <div>
      <span class={keyword}>
        {isAsync ? "async " : undefined}function{isGenerator ? "* " : " "}
      </span>
      <span class={fnName}>{name}</span>
      <TypeParams>{typeParams}</TypeParams>(<Params>
        {params}
      </Params>){returnType && (
        <span>
          : <TypeDef>{returnType}</TypeDef>
        </span>
      )};
    </div>
  ));
  const codeBlock = <div class={gtw("code")}>{items}</div>;
  setState(STYLE_OVERRIDE, prev);
  return codeBlock;
}

function ReturnTypeSubDoc(
  { children, location, id, jsDoc }: {
    children: Child<TsTypeDef | undefined>;
    location: Location;
    id: string;
    jsDoc?: JsDocNode;
  },
) {
  const returnType = take(children);
  if (!returnType) {
    return;
  }
  const itemId = `${id}_return_type`;
  const doc = getReturnDoc(jsDoc);

  return (
    <div>
      <SubSectionTitle id={id}>Return Type</SubSectionTitle>
      <div class={gtw("docSubItem")} id={itemId}>
        <Anchor>{itemId}</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            <TypeDef inline>{returnType}</TypeDef>
          </DocWithLink>
          {doc && <Markdown style={largeMarkdownStyles}>{doc}</Markdown>}
        </div>
      </div>
    </div>
  );
}

export function FnDoc(
  { children }: { children: Child<DocNodeFunction[]> },
) {
  const fns = take(children);
  const isSingle = fns.length === 1;
  const items = fns.map(
    (
      {
        location,
        name,
        jsDoc,
        functionDef: { typeParams, params, returnType },
      },
      i,
    ) => {
      const id = `overload_${i}`;
      return (
        <div class={gtw("docItem")} id={id}>
          <Anchor>{id}</Anchor>
          <div class={gtw("docEntry")}>
            <DocWithLink location={location}>
              {name}
              <TypeParams>{typeParams}</TypeParams>(<Params inline>
                {params}
              </Params>)
              {returnType && (
                <span>
                  : <TypeDef>{returnType}</TypeDef>
                </span>
              )}
            </DocWithLink>
            {!isSingle
              ? <JsDoc style={largeMarkdownStyles}>{jsDoc}</JsDoc>
              : undefined}
          </div>
          <TypeParamsSubDoc location={location} id={id} jsDoc={jsDoc}>
            {typeParams}
          </TypeParamsSubDoc>
          <ParamsSubDoc location={location} id={id} jsDoc={jsDoc}>
            {params}
          </ParamsSubDoc>
          <ReturnTypeSubDoc location={location} id={id} jsDoc={jsDoc}>
            {returnType}
          </ReturnTypeSubDoc>
        </div>
      );
    },
  );
  return <div class={gtw("docItems")}>{items}</div>;
}
