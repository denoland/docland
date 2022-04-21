// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, htmlEntities } from "../deps.ts";
import type {
  DocNodeTypeAlias,
  JsDoc,
  LiteralCallSignatureDef,
  LiteralIndexSignatureDef,
  LiteralMethodDef,
  LiteralPropertyDef,
  Location,
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
} from "../deps.ts";
import { getState, setState, store, STYLE_OVERRIDE } from "../shared.ts";
import type { StoreState } from "../shared.ts";
import { take } from "../util.ts";
import type { Child } from "../util.ts";
import {
  Anchor,
  DocWithLink,
  getLink,
  SectionTitle,
  SubSectionTitle,
  TocLink,
} from "./common.tsx";
import { getTypeParamDoc, Markdown } from "./jsdoc.tsx";
import { Params } from "./params.tsx";
import { codeBlockStyles, gtw, largeMarkdownStyles } from "./styles.ts";

interface TypeDefProps<Def extends TsTypeDef = TsTypeDef> {
  children: Child<Def>;
  inline?: boolean;
  terminate?: boolean;
}

function MappedReadOnly(
  { children }: { children: Child<TruePlusMinus | undefined> },
) {
  const readonly = take(children);
  const so = getState(STYLE_OVERRIDE);
  const keyword = gtw("keyword", so);
  switch (readonly) {
    case true:
      return <span class={keyword}>readonly{" "}</span>;
    case "+":
      return <span class={keyword}>+readonly{" "}</span>;
    case "-":
      return <span class={keyword}>-readonly{" "}</span>;
    default:
      return undefined;
  }
}

function MappedOptional(
  { children }: { children: Child<TruePlusMinus | undefined> },
) {
  const optional = take(children);
  switch (optional) {
    case true:
      return <span>?</span>;
    case "+":
      return <span>+?</span>;
    case "-":
      return <span>-?</span>;
    default:
      return undefined;
  }
}

export function TypeArguments(
  { children }: {
    children: Child<TsTypeDef[] | undefined>;
  },
) {
  const args = take(children, true);
  if (!args || !args.length || !args[0]) {
    return;
  }
  const items = [];
  for (let i = 0; i < args.length; i++) {
    items.push(<TypeDef inline>{args[i]}</TypeDef>);
    if (i < args.length - 1) {
      items.push(<span>,{" "}</span>);
    }
  }
  return <span>&lt;{items}&gt;</span>;
}

export function TypeDef({ children, ...props }: TypeDefProps) {
  const def = take(children);
  const terminalChar = props.terminate ? ";" : "";
  switch (def.kind) {
    case "array":
      return (
        <>
          <TypeDefArray {...props}>{def}</TypeDefArray>
          {terminalChar}
        </>
      );
    case "conditional":
      return (
        <>
          <TypeDefConditional>{def}</TypeDefConditional>
          {terminalChar}
        </>
      );
    case "fnOrConstructor":
      return (
        <>
          <TypeDefFnOrConstructor {...props}>{def}</TypeDefFnOrConstructor>
          {terminalChar}
        </>
      );
    case "importType":
      return (
        <>
          <TypeDefImport>{def}</TypeDefImport>
          {terminalChar}
        </>
      );
    case "indexedAccess":
      return (
        <>
          <TypeDefIndexedAccess>{def}</TypeDefIndexedAccess>
          {terminalChar}
        </>
      );
    case "infer":
      return (
        <>
          <TypeDefInfer>{def}</TypeDefInfer>
          {terminalChar}
        </>
      );
    case "intersection":
      return <TypeDefIntersection {...props}>{def}</TypeDefIntersection>;
    case "keyword":
      return (
        <>
          <TypeDefKeyword>{def}</TypeDefKeyword>
          {terminalChar}
        </>
      );
    case "literal":
      return (
        <>
          <TypeDefLiteral>{def}</TypeDefLiteral>
          {terminalChar}
        </>
      );
    case "mapped":
      return <TypeDefMapped {...props}>{def}</TypeDefMapped>;
    case "optional":
      return (
        <>
          <TypeDefOptional>{def}</TypeDefOptional>
          {terminalChar}
        </>
      );
    case "parenthesized":
      return (
        <>
          <TypeDefParenthesized>{def}</TypeDefParenthesized>
          {terminalChar}
        </>
      );
    case "rest":
      return (
        <>
          <TypeDefRest>{def}</TypeDefRest>
          {terminalChar}
        </>
      );
    case "this":
      return (
        <>
          <TypeDefThis />
          {terminalChar}
        </>
      );
    case "tuple":
      return (
        <>
          <TypeDefTuple {...props}>{def}</TypeDefTuple>
          {terminalChar}
        </>
      );
    case "typeLiteral":
      return (
        <>
          <TypeDefTypeLiteral>{def}</TypeDefTypeLiteral>
          {terminalChar}
        </>
      );
    case "typeOperator":
      return (
        <>
          <TypeDefOperator>{def}</TypeDefOperator>
          {terminalChar}
        </>
      );
    case "typePredicate":
      return (
        <>
          <TypeDefPredicate>{def}</TypeDefPredicate>
          {terminalChar}
        </>
      );
    case "typeQuery":
      return (
        <>
          <TypeDefQuery>{def}</TypeDefQuery>
          {terminalChar}
        </>
      );
    case "typeRef":
      return (
        <>
          <TypeDefRef>{def}</TypeDefRef>
          {terminalChar}
        </>
      );
    case "union":
      return <TypeDefUnion {...props}>{def}</TypeDefUnion>;
    default:
      // deno-lint-ignore no-explicit-any
      return <span>{htmlEntities.encode((def as any).repr)}</span>;
  }
}

function TypeDefArray({ children }: TypeDefProps<TsTypeArrayDef>) {
  const { array } = take(children);
  return (
    <span>
      <TypeDef inline>{array}</TypeDef>[]
    </span>
  );
}

function TypeDefConditional({ children }: TypeDefProps<TsTypeConditionalDef>) {
  const { conditionalType: { checkType, extendsType, trueType, falseType } } =
    take(children);
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      <TypeDef>{checkType}</TypeDef>{" "}
      <span class={gtw("keyword", so)}>extends</span>{" "}
      <TypeDef>{extendsType}</TypeDef> ? <TypeDef>{trueType}</TypeDef> :{" "}
      <TypeDef>{falseType}</TypeDef>
    </span>
  );
}

function TypeDefFnOrConstructor(
  { children, inline }: TypeDefProps<TsTypeFnOrConstructorDef>,
) {
  const { fnOrConstructor: { constructor, typeParams, params, tsType } } = take(
    children,
  );
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      {constructor ? <span class={gtw("keyword", so)}>new{" "}</span> : ""}
      <TypeParams>{typeParams}</TypeParams>(<Params inline={inline}>
        {params}
      </Params>) =&gt; <TypeDef inline={inline}>{tsType}</TypeDef>
    </span>
  );
}

function TypeDefImport({ children }: TypeDefProps<TsTypeImportTypeDef>) {
  const { importType: { specifier, qualifier, typeParams } } = take(children);
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      <span class={gtw("keyword", so)}>import</span>("{specifier}"){qualifier &&
        <span>.{qualifier}</span>}
      <TypeArguments>{typeParams}</TypeArguments>
    </span>
  );
}

function TypeDefIndexedAccess(
  { children }: TypeDefProps<TsTypeIndexedAccessDef>,
) {
  const { indexedAccess: { objType, indexType } } = take(children);
  return (
    <span>
      <TypeDef inline>{objType}</TypeDef>[<TypeDef inline>{indexType}</TypeDef>]
    </span>
  );
}

function TypeDefInfer({ children }: TypeDefProps<TsTypeInferDef>) {
  const { infer: { typeParam } } = take(children);
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      <span class={gtw("keyword", so)}>infer{" "}</span>
      <TypeParam>{typeParam}</TypeParam>
    </span>
  );
}

function TypeDefIntersection(
  { children, inline, terminate }: TypeDefProps<TsTypeIntersectionDef>,
) {
  const { intersection } = take(children);
  const so = getState(STYLE_OVERRIDE);
  const keyword = gtw("keyword", so);
  const lastIndex = intersection.length - 1;
  if (inline || intersection.length <= 3) {
    const defs = [];
    for (let i = 0; i < intersection.length; i++) {
      defs.push(<TypeDef>{intersection[i]}</TypeDef>);
      if (i < lastIndex) {
        defs.push(<span class={keyword}>{" "}&amp;{" "}</span>);
      }
    }
    if (terminate) {
      defs.push(";");
    }
    return <span>{defs}</span>;
  }
  return (
    <div class={gtw("indent", so)}>
      {intersection.map((def, i) => (
        <div>
          <span class={keyword}>{" "}&amp;{" "}</span>
          <TypeDef inline={inline}>{def}</TypeDef>
          {terminate && i === lastIndex ? ";" : ""}
        </div>
      ))}
    </div>
  );
}

function TypeDefKeyword({ children }: TypeDefProps<TsTypeKeywordDef>) {
  const { keyword } = take(children);
  const so = getState(STYLE_OVERRIDE);
  return <span class={gtw("typeKeyword", so)}>{keyword}</span>;
}

function TypeDefLiteral({ children }: TypeDefProps<TsTypeDefLiteral>) {
  const { literal: { kind }, repr } = take(children);
  const so = getState(STYLE_OVERRIDE);
  switch (kind) {
    case "bigInt":
      return <span class={gtw("numberLiteral", so)}>{repr}</span>;
    case "boolean":
      return <span class={gtw("boolean", so)}>{repr}</span>;
    case "number":
      return <span class={gtw("numberLiteral", so)}>{repr}</span>;
    case "string":
      return <span class={gtw("stringLiteral", so)}>"{repr}"</span>;
    case "template":
      // TODO(@kitsonk) do this properly
      return <span class={gtw("stringLiteral", so)}>`{repr}`</span>;
  }
}

function TypeDefOperator({ children }: TypeDefProps<TsTypeTypeOperatorDef>) {
  const { typeOperator: { operator, tsType } } = take(children);
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      <span class={gtw("typeKeyword", so)}>{operator}</span>{" "}
      <TypeDef>{tsType}</TypeDef>
    </span>
  );
}

function TypeDefMapped(
  { children, inline, terminate }: TypeDefProps<TsTypeMappedDef>,
) {
  const {
    mappedType: { readonly, typeParam, nameType, optional, tsType },
    // TODO(@kitsonk) remove, see: https://github.com/denoland/deno_doc/issues/226
    // deno-lint-ignore no-explicit-any
  } = take(children) as any;
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      <MappedReadOnly>{readonly}</MappedReadOnly>
      [<TypeParam constraint="in">{typeParam}</TypeParam>
      {nameType && (
        <span>
          <span class={gtw("keyword", so)}>in keyof{" "}</span>
          <TypeDef inline={inline}>{nameType}</TypeDef>
        </span>
      )}]<MappedOptional>{optional}</MappedOptional>
      {tsType && (
        <span>
          : <TypeDef inline={inline}>{tsType}</TypeDef>
        </span>
      )}
      {terminate ? ";" : undefined}
    </span>
  );
}

function TypeDefOptional(
  { children, inline }: TypeDefProps<TsTypeOptionalDef>,
) {
  const { optional } = take(children);
  return (
    <span>
      <TypeDef inline={inline}>{optional}</TypeDef>
    </span>
  );
}

function TypeDefParenthesized(
  { children, inline }: TypeDefProps<TsTypeParenthesizedDef>,
) {
  const { parenthesized } = take(children);
  return (
    <span>
      (<TypeDef inline={inline}>{parenthesized}</TypeDef>)
    </span>
  );
}

function TypeDefPredicate({ children }: TypeDefProps<TsTypeTypePredicateDef>) {
  const { typePredicate: { asserts, param, type } } = take(children);
  const so = getState(STYLE_OVERRIDE);
  return (
    <span>
      {asserts
        ? <span class={gtw("keyword", so)}>asserts{" "}</span>
        : undefined}
      {param.type === "this"
        ? <span class={gtw("typeKeyword", so)}>this</span>
        : param.name}
      {type && (
        <span>
          {" is "}
          <TypeDef>{type}</TypeDef>
        </span>
      )}
    </span>
  );
}

function TypeDefQuery({ children }: TypeDefProps<TsTypeQueryDef>) {
  const { typeQuery } = take(children);
  return <span>{typeQuery}</span>;
}

function TypeDefRef({ children }: TypeDefProps<TsTypeTypeRefDef>) {
  const { typeRef: { typeName, typeParams } } = take(children);
  return (
    <span>
      <TypeRefLink>{typeName}</TypeRefLink>
      <TypeArguments>{typeParams}</TypeArguments>
    </span>
  );
}

function TypeDefRest({ children, inline }: TypeDefProps<TsTypeRestDef>) {
  const { rest } = take(children);
  return (
    <span>
      ...<TypeDef inline={inline}>{rest}</TypeDef>
    </span>
  );
}

function TypeDefThis() {
  const so = getState(STYLE_OVERRIDE);
  return <span class={gtw("typeKeyword", so)}>this</span>;
}

function TypeDefTuple({ children, inline }: TypeDefProps<TsTypeTupleDef>) {
  const { tuple } = take(children);
  if (inline || tuple.length <= 3) {
    const items = [];
    for (let i = 0; i < tuple.length; i++) {
      items.push(<TypeDef inline={inline}>{tuple[i]}</TypeDef>);
      if (i < tuple.length - 1) {
        items.push(", ");
      }
    }
    return <span>[{items}]</span>;
  }
  const so = getState(STYLE_OVERRIDE);
  return (
    <div class={gtw("indent", so)}>
      [{tuple.map((def) => (
        <div>
          <TypeDef inline={inline}>{def}</TypeDef>,{" "}
        </div>
      ))}]
    </div>
  );
}

function LiteralIndexSignatures(
  { children, inline }: {
    children: Child<LiteralIndexSignatureDef[]>;
    inline?: boolean;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return;
  }
  const so = getState(STYLE_OVERRIDE);
  const items = signatures.map(({ params, readonly, tsType }) => {
    const item = (
      <span>
        {readonly
          ? <span class={gtw("keyword", so)}>readonly{" "}</span>
          : undefined}[<Params>{params}</Params>]{tsType && (
          <span>
            : <TypeDef inline>{tsType}</TypeDef>
          </span>
        )};{" "}
      </span>
    );
    return inline ? item : <div>{item}</div>;
  });
  return inline ? items : <div class={gtw("indent", so)}>{items}</div>;
}

function LiteralCallSignatures(
  { children, inline }: {
    children: Child<LiteralCallSignatureDef[]>;
    inline?: boolean;
  },
) {
  const items = take(children, true);
  const so = getState(STYLE_OVERRIDE);
  return items.map(({ typeParams, params, tsType }) => {
    const item = (
      <span>
        <TypeParams>{typeParams}</TypeParams>(<Params>
          {params}
        </Params>){tsType &&
          (
            <span>
              : <TypeDef inline>{tsType}</TypeDef>
            </span>
          )};{" "}
      </span>
    );
    return inline ? item : <div class={gtw("indent", so)}>{item}</div>;
  });
}

function LiteralProperties(
  { children, inline }: {
    children: Child<LiteralPropertyDef[]>;
    inline?: boolean;
  },
) {
  const props = take(children, true);
  const so = getState(STYLE_OVERRIDE);
  return props.map(({ name, readonly, computed, optional, tsType }) => {
    const item = (
      <span>
        {readonly
          ? <span class={gtw("keyword", so)}>readonly{" "}</span>
          : undefined}
        {computed ? `[${name}]` : name}
        {optional ? "?" : undefined}
        {tsType
          ? (
            <span>
              : <TypeDef terminate>{tsType}</TypeDef>
              {" "}
            </span>
          )
          : "; "}
      </span>
    );
    return inline ? item : <div class={gtw("indent", so)}>{item}</div>;
  });
}

function LiteralMethods(
  { children, inline }: {
    children: Child<LiteralMethodDef[]>;
    inline?: boolean;
  },
) {
  const methods = take(children, true);
  const so = getState(STYLE_OVERRIDE);
  return methods.map((
    { name, kind, optional, computed, returnType, typeParams, params },
  ) => {
    const item = (
      <span>
        {kind === "getter"
          ? <span class={gtw("keyword", so)}>get{" "}</span>
          : kind === "setter"
          ? <span class={gtw("keyword", so)}>set{" "}</span>
          : undefined}
        {name === "new"
          ? <span class={gtw("keyword", so)}>{name}{" "}</span>
          : computed
          ? `[${name}]`
          : name}
        {optional ? "?" : undefined}
        <TypeParams>{typeParams}</TypeParams>(<Params>
          {params}
        </Params>){returnType
          ? (
            <span>
              : <TypeDef terminate>{returnType}</TypeDef>
              {" "}
            </span>
          )
          : "; "}
      </span>
    );
    return inline ? item : <div class={gtw("indent", so)}>{item}</div>;
  });
}

function TypeDefTypeLiteral(
  { children, inline, terminate }: TypeDefProps<TsTypeTypeLiteralDef>,
) {
  const {
    typeLiteral: { indexSignatures, callSignatures, properties, methods },
  } = take(children);
  return (
    <span>
      &#123;
      <LiteralIndexSignatures inline={inline}>
        {indexSignatures}
      </LiteralIndexSignatures>
      <LiteralCallSignatures inline={inline}>
        {callSignatures}
      </LiteralCallSignatures>
      <LiteralProperties inline={inline}>{properties}</LiteralProperties>
      <LiteralMethods inline={inline}>{methods}</LiteralMethods>
      &#125;
      {terminate ? ";" : undefined}
    </span>
  );
}

function TypeDefUnion(
  { children, inline, terminate }: TypeDefProps<TsTypeUnionDef>,
) {
  const { union } = take(children);
  const so = getState(STYLE_OVERRIDE);
  const keyword = gtw("keyword", so);
  const lastIndex = union.length - 1;
  if (inline || union.length <= 3) {
    const defs = [];
    for (let i = 0; i < union.length; i++) {
      defs.push(<TypeDef>{union[i]}</TypeDef>);
      if (i < lastIndex) {
        defs.push(<span class={keyword}>{" "}|{" "}</span>);
      }
    }
    if (terminate) {
      defs.push(";");
    }
    return <span>{defs}</span>;
  }
  return (
    <div class={gtw("indent", so)}>
      {union.map((def, i) => (
        <div>
          <span class={keyword}>{" "}|{" "}</span>
          <TypeDef inline={inline}>{def}</TypeDef>
          {terminate && i === lastIndex ? ";" : ""}
        </div>
      ))}
    </div>
  );
}

function TypeRefLink({ children }: { children: Child<string> }) {
  const name = take(children);
  const { entries, url, namespaces } = store.state as StoreState;
  const href = getLink(name, url, entries, namespaces);
  if (!href) {
    return name;
  }
  const so = getState(STYLE_OVERRIDE);
  return <a href={href} class={gtw("typeLink", so)}>{name}</a>;
}

function TypeParam(
  { children, constraint = "extends" }: {
    children: Child<TsTypeParamDef>;
    constraint?: string;
  },
) {
  const param = take(children);
  const so = getState(STYLE_OVERRIDE);
  const keyword = gtw("keyword", so);
  return (
    <span>
      <span class={gtw("typeParam", so)}>{param.name}</span>
      {param.constraint && (
        <span>
          <span class={keyword}>{` ${constraint} `}</span>
          <TypeDef>{param.constraint}</TypeDef>
        </span>
      )}
      {param.default && (
        <span>
          <span class={keyword}>{" "}={" "}</span>
          <TypeDef>{param.default}</TypeDef>
        </span>
      )}
    </span>
  );
}

export function TypeAliasCodeBlock(
  { children }: { children: Child<DocNodeTypeAlias> },
) {
  const { name, typeAliasDef: { typeParams, tsType } } = take(children);
  const prev = getState(STYLE_OVERRIDE);
  setState(STYLE_OVERRIDE, codeBlockStyles);
  const codeBlock = (
    <div class={gtw("code")}>
      <span class={gtw("keyword", codeBlockStyles)}>type</span> {name}
      <TypeParams>{typeParams}</TypeParams> ={" "}
      <TypeDef terminate>{tsType}</TypeDef>
    </div>
  );
  setState(STYLE_OVERRIDE, prev);
  return codeBlock;
}

export function TypeAliasDoc(
  { children }: { children: Child<DocNodeTypeAlias> },
) {
  const { typeAliasDef: { tsType, typeParams }, location } = take(children);
  return (
    <div class={gtw("docItems")}>
      <TypeParamsDoc location={location}>{typeParams}</TypeParamsDoc>
      <TypeDefDoc location={location}>{tsType}</TypeDefDoc>
    </div>
  );
}

export function TypeAliasToc(
  { children }: { children: Child<DocNodeTypeAlias> },
) {
  const { name, typeAliasDef: { typeParams } } = take(children);
  return (
    <div>
      <h3 class={gtw("tocHeader")}>{name}</h3>
      <ul>
        {typeParams.length ? <TocLink>Type Parameters</TocLink> : undefined}
        <TocLink>Type</TocLink>
      </ul>
    </div>
  );
}

export function TypeParams(
  { children }: { children: Child<TsTypeParamDef[]> },
) {
  const params = take(children, true);
  if (!params.length) {
    return;
  }
  const items = [];
  for (let i = 0; i < params.length; i++) {
    items.push(<TypeParam>{params[i]}</TypeParam>);
    if (i < params.length - 1) {
      items.push(<span>,{" "}</span>);
    }
  }
  return <span>&lt;{items}&gt;</span>;
}

export function TypeParamsDoc(
  { children, location }: {
    children: Child<TsTypeParamDef[]>;
    location: Location;
  },
) {
  const params = take(children, true);
  if (!params.length) {
    return;
  }
  const items = params.map((param) => {
    return (
      <div class={gtw("docItem")} id={param.name}>
        <Anchor>{param.name}</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            <TypeParam>{param}</TypeParam>
          </DocWithLink>
        </div>
      </div>
    );
  });
  return (
    <div>
      <SectionTitle>Type Parameters</SectionTitle>
      {items}
    </div>
  );
}

export function TypeDefDoc(
  { children, location }: { children: Child<TsTypeDef>; location: Location },
) {
  const def = take(children);
  return (
    <div>
      <SectionTitle>Type</SectionTitle>
      <div class={gtw("docItem")} id="typedef">
        <Anchor>typedef</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            <TypeDef inline>{def}</TypeDef>
          </DocWithLink>
        </div>
      </div>
    </div>
  );
}

export function TypeParamsSubDoc(
  { children, location, id, jsDoc }: {
    children: Child<TsTypeParamDef[]>;
    location: Location;
    id: string;
    jsDoc?: JsDoc;
  },
) {
  const typeParams = take(children, true);
  if (!typeParams.length) {
    return;
  }
  const typeParamDoc = getTypeParamDoc(typeParams, jsDoc);
  const items = typeParams.map((typeParam, i) => {
    const itemId = `${id}_${typeParam.name}`;
    const doc = typeParamDoc[i];
    return (
      <div class={gtw("docSubItem")} id={itemId}>
        <Anchor>{itemId}</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            <TypeParam>{typeParam}</TypeParam>
          </DocWithLink>
          {doc && <Markdown style={largeMarkdownStyles}>{doc}</Markdown>}
        </div>
      </div>
    );
  });
  return (
    <div>
      <SubSectionTitle id={id}>Type Parameters</SubSectionTitle>
      {items}
    </div>
  );
}
