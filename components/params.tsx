// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import type {
  JsDoc,
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
} from "../deps.ts";
import { take } from "../util.ts";
import type { Child } from "../util.ts";
import { Anchor, DocWithLink, SubSectionTitle } from "./common.tsx";
import { getParamDoc, Markdown, Tag } from "./jsdoc.tsx";
import { gtw, largeMarkdownStyles } from "./styles.ts";
import { TypeDef } from "./types.tsx";

interface ObjectPatProps<Pattern extends ObjectPatPropDef> {
  children: Child<Pattern>;
}

interface ParamProps<P extends ParamDef> {
  children: Child<P>;
  optional?: boolean;
  inline?: boolean;
}

interface ParamsProps {
  children: Child<ParamDef[]>;
  inline?: boolean;
}

function isOptional(param: ParamDef): boolean {
  switch (param.kind) {
    case "array":
    case "identifier":
    case "object":
      return param.optional;
    case "assign":
    case "rest":
      return true;
  }
}

function ObjectAssignPat({ children }: ObjectPatProps<ObjectPatPropAssignDef>) {
  const pattern = take(children);
  return (
    <span>
      {pattern.key}
      {pattern.value && pattern.value !== "[UNSUPPORTED]"
        ? `= ${pattern.value}`
        : undefined}
    </span>
  );
}

function ObjectKeyValuePat(
  { children }: ObjectPatProps<ObjectPatPropKeyValueDef>,
) {
  const pattern = take(children);
  return (
    <span>
      {pattern.key}: <Param>{pattern.value}</Param>
    </span>
  );
}

function ObjectRestPat({ children }: ObjectPatProps<ObjectPatPropRestDef>) {
  const pattern = take(children);
  return (
    <span>
      ...<Param>{pattern.arg}</Param>
    </span>
  );
}

function ObjectPat({ children }: ObjectPatProps<ObjectPatPropDef>) {
  const pattern = take(children);
  switch (pattern.kind) {
    case "assign":
      return <ObjectAssignPat>{pattern}</ObjectAssignPat>;
    case "keyValue":
      return <ObjectKeyValuePat>{pattern}</ObjectKeyValuePat>;
    case "rest":
      return <ObjectRestPat>{pattern}</ObjectRestPat>;
  }
}

function ParamArray({ children, optional, inline }: ParamProps<ParamArrayDef>) {
  const param = take(children);
  return (
    <span>
      [{param.elements.map((e) =>
        e && <Param inline={inline}>{e}</Param>
      )}]{param.optional || optional ? "?" : ""}
      {param.tsType && (
        <span>
          : <TypeDef inline={inline}>{param.tsType}</TypeDef>
        </span>
      )}
    </span>
  );
}

function ParamAssign({ children, inline }: ParamProps<ParamAssignDef>) {
  const param = take(children);
  return (
    <span>
      <Param optional inline={inline}>{param.left}</Param>
      {param.tsType && <TypeDef inline={inline}>{param.tsType}</TypeDef>}
    </span>
  );
}

function ParamIdentifier(
  { children, optional, inline }: ParamProps<ParamIdentifierDef>,
) {
  const param = take(children);
  return (
    <span>
      {param.name}
      {param.optional || optional ? "?" : ""}
      {param.tsType && (
        <span>
          : <TypeDef inline={inline}>{param.tsType}</TypeDef>
        </span>
      )}
    </span>
  );
}

function ParamObject(
  { children, optional, inline }: ParamProps<ParamObjectDef>,
) {
  const param = take(children);
  const props = [];
  for (let i = 0; i < param.props.length; i++) {
    props.push(<ObjectPat>{param.props[i]}</ObjectPat>);
    if (i < param.props.length - 1) {
      props.push(<span>,{" "}</span>);
    }
  }
  return (
    <span>
      &#123; {props} &#125;{param.optional || optional ? "?" : ""}
      {param.tsType && (
        <span>
          : <TypeDef inline={inline}>{param.tsType}</TypeDef>
        </span>
      )}
    </span>
  );
}

function ParamRest({ children, inline }: ParamProps<ParamRestDef>) {
  const param = take(children);
  return (
    <span>
      ...<Param inline={inline}>{param.arg}</Param>
      {param.tsType && (
        <span>
          : <TypeDef inline={inline}>{param.tsType}</TypeDef>
        </span>
      )}
    </span>
  );
}

function Param({ children, ...props }: ParamProps<ParamDef>) {
  const param = take(children);
  switch (param.kind) {
    case "array":
      return <ParamArray {...props}>{param}</ParamArray>;
    case "assign":
      return <ParamAssign {...props}>{param}</ParamAssign>;
    case "identifier":
      return <ParamIdentifier {...props}>{param}</ParamIdentifier>;
    case "object":
      return <ParamObject {...props}>{param}</ParamObject>;
    case "rest":
      return <ParamRest {...props}>{param}</ParamRest>;
  }
}

export function Params({ children, inline }: ParamsProps) {
  const params = take(children, true);
  if (!params.length) {
    return;
  }

  if (params.length < 3 || inline) {
    const items = [];
    for (let i = 0; i < params.length; i++) {
      items.push(<Param inline={inline}>{params[i]}</Param>);
      if (i < params.length - 1) {
        items.push(<span>,{" "}</span>);
      }
    }
    return items;
  }
  return params.map((param) => (
    <div class={gtw("indent")}>
      <Param inline={inline}>{param}</Param>,
    </div>
  ));
}

export function ParamsSubDoc(
  { children, location, id, jsDoc }: {
    children: Child<ParamDef[]>;
    location: Location;
    id: string;
    jsDoc?: JsDoc;
  },
) {
  const params = take(children, true);
  if (!params.length) {
    return;
  }
  const paramDoc = getParamDoc(params, jsDoc);
  const items = params.map((param, i) => {
    const itemId = `${id}_param_${i}`;
    const doc = paramDoc[i];
    return (
      <div class={gtw("docSubItem")} id={itemId}>
        <Anchor>{itemId}</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            <Param inline>{param}</Param>
            {isOptional(param) ? <Tag color="cyan">optional</Tag> : undefined}
          </DocWithLink>
          {doc && <Markdown style={largeMarkdownStyles}>{doc}</Markdown>}
        </div>
      </div>
    );
  });

  return (
    <div>
      <SubSectionTitle id={id}>Parameters</SubSectionTitle>
      {items}
    </div>
  );
}
