// Copyright 2021 the Deno authors. All rights reserved. MIT license.
/** @jsx h */
import { h } from "../deps.ts";
import type {
  ClassConstructorDef,
  ClassMethodDef,
  ClassPropertyDef,
  DocNodeClass,
  Location,
  TsTypeDef,
} from "../deps.ts";
import { getState, setState, STYLE_OVERRIDE } from "../shared.ts";
import { assert, take } from "../util.ts";
import type { Child } from "../util.ts";
import { Decorators, DecoratorsDoc, DecoratorsSubDoc } from "./decorators.tsx";
import {
  Anchor,
  DocWithLink,
  SectionTitle,
  TARGET_RE,
  TocLink,
} from "./common.tsx";
import { IndexSignatures, IndexSignaturesDoc } from "./interfaces.tsx";
import { AccessibilityTag, isDeprecated, JsDoc, Tag } from "./jsdoc.tsx";
import { Params } from "./params.tsx";
import { codeBlockStyles, gtw, largeMarkdownStyles } from "./styles.ts";
import { TypeArguments, TypeDef, TypeParams, TypeParamsDoc } from "./types.tsx";

type ClassAccessorDef = ClassMethodDef & { kind: "getter" | "setter" };
type ClassGetterDef = ClassMethodDef & { kind: "getter" };
type ClassSetterDef = ClassMethodDef & { kind: "setter" };
type ClassItemType = "prop" | "method" | "static_prop" | "static_method";
type ClassItemDef = ClassMethodDef | ClassPropertyDef;

/** Compares the accessibility of a property ot method, so that private and
 * protected methods are listed before public properties or methods. */
function compareAccessibility(
  a: ClassPropertyDef | ClassMethodDef,
  b: ClassPropertyDef | ClassMethodDef,
): number {
  if (a.accessibility !== b.accessibility) {
    if (a.accessibility === "private") {
      return -1;
    }
    if (b.accessibility === "private") {
      return 1;
    }
    if (a.accessibility === "protected") {
      return -1;
    }
    if (b.accessibility === "protected") {
      return 1;
    }
  }
  if (a.name === b.name && isClassAccessor(a) && isClassAccessor(b)) {
    return a.kind === "getter" ? -1 : 1;
  }
  if (a.name.startsWith("[") && b.name.startsWith("[")) {
    return a.name.localeCompare(b.name);
  }
  if (a.name.startsWith("[")) {
    return 1;
  }
  if (b.name.startsWith("[")) {
    return -1;
  }
  return a.name.localeCompare(b.name);
}

function isClassMethod(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassMethodDef & { kind: "method" } {
  return "kind" in value && value.kind === "method";
}

function isClassAccessor(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassAccessorDef {
  return "kind" in value &&
    (value.kind === "getter" || value.kind === "setter");
}

function isClassGetter(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassGetterDef {
  return "kind" in value && value.kind === "getter";
}

function isClassSetter(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassSetterDef {
  return "kind" in value && value.kind === "setter";
}

function isClassProperty(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassPropertyDef {
  return "readonly" in value;
}

function getClassItemType(
  item: ClassPropertyDef | ClassMethodDef,
): ClassItemType {
  if (item.isStatic) {
    return isClassProperty(item) || isClassAccessor(item)
      ? "static_prop"
      : "static_method";
  } else {
    return isClassProperty(item) || isClassAccessor(item) ? "prop" : "method";
  }
}

function getClassItemLabel(type: ClassItemType) {
  switch (type) {
    case "method":
      return "Methods";
    case "prop":
      return "Properties";
    case "static_method":
      return "Static Methods";
    case "static_prop":
      return "Static Properties";
  }
}

function ClassAccessorDoc(
  { get, set }: { get?: ClassGetterDef; set?: ClassSetterDef },
) {
  const name = (get ?? set)?.name;
  assert(name);
  const target = name.replaceAll(TARGET_RE, "_");
  const tsType = get?.functionDef.returnType ??
    (set?.functionDef.params[0])?.tsType;
  const jsDoc = get?.jsDoc ?? set?.jsDoc;
  const location = get?.location ?? set?.location;
  const accessibility = get?.accessibility ?? set?.accessibility;
  const isAbstract = get?.isAbstract ?? set?.isAbstract;
  const tags = [];
  if (isAbstract) {
    tags.push(<Tag color="yellow">abstract</Tag>);
  }
  tags.push(<AccessibilityTag>{accessibility}</AccessibilityTag>);
  if (!set) {
    tags.push(<Tag color="purple">readonly</Tag>);
  }
  if (isDeprecated(jsDoc)) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }
  assert(location);
  return (
    <div class={gtw("docItem")} id={target}>
      <Anchor>{target}</Anchor>
      <div class={gtw("docEntry")}>
        <DocWithLink location={location}>
          {name}
          {tsType && (
            <span>
              : <TypeDef inline>{tsType}</TypeDef>
            </span>
          )}
          {tags}
        </DocWithLink>
        <JsDoc style={largeMarkdownStyles} tags={["deprecated"]}>{jsDoc}</JsDoc>
      </div>
    </div>
  );
}

export function ClassCodeBlock(
  { children }: { children: Child<DocNodeClass> },
) {
  const node = take(children);
  const {
    name,
    classDef: {
      decorators,
      isAbstract,
      typeParams,
      extends: ext,
      superTypeParams,
      implements: impl,
      constructors,
      indexSignatures,
    },
  } = node;
  const items = getClassItems(node);
  const hasElements =
    !!(constructors.length || indexSignatures.length || items.length);
  const prev = getState(STYLE_OVERRIDE);
  setState(STYLE_OVERRIDE, codeBlockStyles);
  const keyword = gtw("keyword", codeBlockStyles);
  const codeBlock = (
    <div class={gtw("code")}>
      {decorators && <Decorators>{decorators}</Decorators>}
      <span class={keyword}>
        {isAbstract ? "abstract " : ""}class
      </span>{" "}
      {name}
      <TypeParams>{typeParams}</TypeParams>
      {ext && (
        <span>
          <span class={keyword}>{" "}extends{" "}</span>
          {ext}
          <TypeArguments>{superTypeParams}</TypeArguments>
        </span>
      )}
      <Implements>{impl}</Implements> &#123;
      {hasElements
        ? (
          <div class={gtw("classBody", codeBlockStyles)}>
            <Constructors>{constructors}</Constructors>
            <IndexSignatures>{indexSignatures}</IndexSignatures>
            <ClassItems>{items}</ClassItems>
          </div>
        )
        : " "}&#125;
    </div>
  );
  setState(STYLE_OVERRIDE, prev);
  return codeBlock;
}

function ClassItems(
  { children }: { children: Child<ClassItemDef[]> },
) {
  const defs = take(children, true);
  if (!defs.length) {
    return;
  }
  const items = [];
  let prev: ClassItemType | undefined;
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    const curr = getClassItemType(def);
    if (prev && prev !== curr) {
      items.push(<div>&nbsp;</div>);
    }
    prev = curr;
    if (isClassMethod(def) || isClassAccessor(def)) {
      items.push(<ClassMethod>{def}</ClassMethod>);
    } else {
      assert(isClassProperty(def));
      items.push(<ClassProperty>{def}</ClassProperty>);
    }
  }
  const so = getState(STYLE_OVERRIDE);
  return <div class={gtw("indent", so)}>{items}</div>;
}

function ClassItemsDoc(
  { children }: { children: Child<ClassItemDef[]> },
) {
  const defs = take(children);
  if (!defs.length) {
    return;
  }
  const items = [];
  let prev: ClassItemType | undefined;
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    const curr = getClassItemType(def);
    if (curr !== prev) {
      items.push(<SectionTitle>{getClassItemLabel(curr)}</SectionTitle>);
    }
    prev = curr;
    if (isClassGetter(def)) {
      const next = defs[i + 1];
      if (next && isClassSetter(next) && def.name === next.name) {
        i++;
        items.push(<ClassAccessorDoc get={def} set={next} />);
      } else {
        items.push(<ClassAccessorDoc get={def} />);
      }
    } else if (isClassSetter(def)) {
      items.push(<ClassAccessorDoc set={def} />);
    } else if (isClassMethod(def)) {
      const methods = [def];
      let next;
      while (
        (next = defs[i + 1]) && next && isClassMethod(next) &&
        def.name === next.name
      ) {
        i++;
        methods.push(next);
      }
      items.push(<ClassMethodDoc>{methods}</ClassMethodDoc>);
    } else {
      assert(isClassProperty(def));
      items.push(<ClassPropertyDoc>{def}</ClassPropertyDoc>);
    }
  }
  return items;
}

function ClassMethod(
  { children }: { children: Child<ClassMethodDef> },
) {
  const {
    accessibility,
    isAbstract,
    isStatic,
    functionDef: {
      isAsync,
      isGenerator,
      typeParams,
      params,
      returnType,
      decorators,
    },
    kind,
    name,
    optional,
  } = take(children);
  const so = getState(STYLE_OVERRIDE);
  const keyword = gtw("keyword", so);
  return (
    <div>
      {decorators && <Decorators>{decorators}</Decorators>}
      {isStatic || accessibility || isAbstract
        ? (
          <span class={keyword}>
            {isStatic ? "static " : undefined}
            {accessibility && `${accessibility} `}
            {isAbstract ? "abstract " : undefined}
          </span>
        )
        : undefined}
      {isAsync || isGenerator || kind === "getter" || kind === "setter"
        ? (
          <span class={keyword}>
            {isAsync ? "async " : undefined}
            {kind === "getter"
              ? "get "
              : kind === "setter"
              ? "set "
              : undefined}
            {isGenerator ? "*" : undefined}
          </span>
        )
        : undefined}
      <span
        class={kind === "method" && !name.startsWith("[")
          ? gtw("classMethod", so)
          : undefined}
      >
        {name}
      </span>
      {optional ? "?" : ""}
      <TypeParams>{typeParams}</TypeParams>(<Params>{params}
      </Params>){returnType && (
        <span>
          : <TypeDef inline>{returnType}</TypeDef>
        </span>
      )};
      {decorators && <div>&nbsp;</div>}
    </div>
  );
}

function ClassMethodDoc(
  { children }: { children: Child<ClassMethodDef[]> },
) {
  const methods = take(children, true);
  const target = methods[0].name.replaceAll(TARGET_RE, "_");
  return (
    <div class={gtw("docItem")} id={target}>
      <Anchor>{target}</Anchor>
      {methods.map((
        {
          location,
          name,
          jsDoc,
          accessibility,
          optional,
          isAbstract,
          functionDef: { typeParams, params, returnType, decorators },
        },
      ) => {
        const tags = [];
        if (isAbstract) {
          tags.push(<Tag color="yellow">abstract</Tag>);
        }
        tags.push(<AccessibilityTag>{accessibility}</AccessibilityTag>);
        if (optional) {
          tags.push(<Tag color="cyan">optional</Tag>);
        }
        if (isDeprecated(jsDoc)) {
          tags.push(<Tag color="gray">deprecated</Tag>);
        }
        return (
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
              {tags}
            </DocWithLink>
            <JsDoc
              style={largeMarkdownStyles}
              tags={["param", "return", "template", "deprecated"]}
            >
              {jsDoc}
            </JsDoc>
            {decorators && (
              <DecoratorsSubDoc id={name}>{decorators}</DecoratorsSubDoc>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ClassProperty(
  { children }: { children: Child<ClassPropertyDef> },
) {
  const {
    isStatic,
    accessibility,
    isAbstract,
    readonly,
    name,
    optional,
    decorators,
    tsType,
  } = take(children);
  const so = getState(STYLE_OVERRIDE);
  return (
    <div>
      {decorators && <Decorators>{decorators}</Decorators>}
      {isStatic || accessibility || isAbstract || readonly
        ? (
          <span class={gtw("keyword", so)}>
            {isStatic ? "static " : undefined}
            {accessibility && `${accessibility} `}
            {isAbstract ? "abstract " : undefined}
            {readonly ? "readonly " : undefined}
          </span>
        )
        : undefined}
      <span>{name}</span>
      {optional ? "?" : ""}
      {tsType
        ? (
          <span>
            : <TypeDef terminate>{tsType}</TypeDef>
          </span>
        )
        : ";"}
      {decorators && <div>&nbsp;</div>}
    </div>
  );
}

function ClassPropertyDoc(
  { children }: { children: Child<ClassPropertyDef> },
) {
  const {
    location,
    name,
    tsType,
    jsDoc,
    decorators,
    accessibility,
    isAbstract,
    optional,
    readonly,
  } = take(children);
  const target = name.replaceAll(TARGET_RE, "_");
  const tags = [];
  if (isAbstract) {
    tags.push(<Tag color="yellow">abstract</Tag>);
  }
  tags.push(<AccessibilityTag>{accessibility}</AccessibilityTag>);
  if (optional) {
    tags.push(<Tag color="cyan">optional</Tag>);
  }
  if (readonly) {
    tags.push(<Tag color="purple">readonly</Tag>);
  }
  if (isDeprecated(jsDoc)) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }
  return (
    <div class={gtw("docItem")} id={target}>
      <Anchor>{target}</Anchor>
      <div class={gtw("docEntry")}>
        <DocWithLink location={location}>
          {name}
          {tsType && (
            <span>
              : <TypeDef inline>{tsType}</TypeDef>
            </span>
          )}
        </DocWithLink>
        <JsDoc style={largeMarkdownStyles}>{jsDoc}</JsDoc>
        {decorators && (
          <DecoratorsSubDoc id={name}>{decorators}</DecoratorsSubDoc>
        )}
      </div>
    </div>
  );
}

function Constructors(
  { children }: { children: Child<ClassConstructorDef[]> },
) {
  const ctors = take(children, true);
  if (!ctors.length) {
    return;
  }
  const so = getState(STYLE_OVERRIDE);
  const items = ctors.map(({ accessibility, name, params }) => (
    <div>
      {accessibility
        ? <span class={gtw("keyword", so)}>{`${accessibility} `}</span>
        : undefined}
      <span class={gtw("keyword", so)}>{name}</span>(<Params>{params}</Params>);
    </div>
  ));
  return <div class={gtw("indent", so)}>{items}</div>;
}

function ConstructorsDoc(
  { children, name }: {
    children: ClassConstructorDef[] | [ClassConstructorDef[]];
    name: string;
  },
) {
  const ctors = take<ClassConstructorDef[]>(children, true);
  if (!ctors.length) {
    return;
  }
  const items = ctors.map(({ location, params, jsDoc, accessibility }, i) => (
    <div class={gtw("docItem")} id={`ctor_${i}`}>
      <Anchor>{`ctor_${i}`}</Anchor>
      <div class={gtw("docEntry")}>
        <DocWithLink location={location}>
          <span class={gtw("bold")}>new{" "}</span>
          {name}(<Params inline>{params}</Params>)<AccessibilityTag>
            {accessibility}
          </AccessibilityTag>
        </DocWithLink>
        <JsDoc style={largeMarkdownStyles}>{jsDoc}</JsDoc>
      </div>
    </div>
  ));
  return (
    <div>
      <SectionTitle>Constructors</SectionTitle>
      {items}
    </div>
  );
}

function Implements({ children }: { children: Child<TsTypeDef[]> }) {
  const types = take(children, true);
  const so = getState(STYLE_OVERRIDE);
  if (!types.length) {
    return;
  }
  const items = [];
  for (let i = 0; i < types.length; i++) {
    items.push(<TypeDef>{types[i]}</TypeDef>);
    if (i < types.length - 1) {
      items.push(<span>,{" "}</span>);
    }
  }
  return (
    <span>
      {" "}
      <span class={gtw("keyword", so)}>implements{" "}</span>
      {items}
    </span>
  );
}

function getClassItems(
  { classDef: { properties, methods } }: DocNodeClass,
) {
  return [...properties, ...methods].sort((a, b) => {
    if (a.isStatic !== b.isStatic) {
      return a.isStatic ? 1 : -1;
    }
    if (
      (isClassProperty(a) && isClassProperty(b)) ||
      (isClassProperty(a) && isClassAccessor(b)) ||
      (isClassAccessor(a) && isClassProperty(b)) ||
      (isClassMethod(a) && isClassMethod(b))
    ) {
      return compareAccessibility(a, b);
    }
    if (isClassAccessor(a) && !isClassAccessor(b)) {
      return -1;
    }
    if (isClassAccessor(b)) {
      return 1;
    }
    return isClassProperty(a) ? -1 : 1;
  });
}

function ExtendsDoc(
  { children, typeArgs, location }: {
    children: Child<string | undefined>;
    typeArgs: TsTypeDef[];
    location: Location;
  },
) {
  const ext = take(children);
  if (!ext) {
    return;
  }
  const id = `extends_${ext}`.replaceAll(TARGET_RE, "_");
  return (
    <div>
      <SectionTitle>Extends</SectionTitle>
      <div class={gtw("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            {ext}
            <TypeArguments>{typeArgs}</TypeArguments>
          </DocWithLink>
        </div>
      </div>
    </div>
  );
}

function ImplementsDoc(
  { children, location }: { children: Child<TsTypeDef[]>; location: Location },
) {
  const impls = take(children);
  if (!impls.length) {
    return;
  }
  const items = impls.map((impl, i) => {
    const id = `i_${i}`;
    return (
      <div class={gtw("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <div class={gtw("docEntry")}>
          <DocWithLink location={location}>
            <TypeDef>{impl}</TypeDef>
          </DocWithLink>
        </div>
      </div>
    );
  });
  return (
    <div>
      <SectionTitle>Implements</SectionTitle>
      {items}
    </div>
  );
}

export function ClassDoc({ children }: { children: Child<DocNodeClass> }) {
  const node = take(children);
  const {
    name,
    classDef: {
      constructors,
      decorators,
      indexSignatures,
      extends: ext,
      implements: impl,
      typeParams,
      superTypeParams,
    },
    location,
  } = node;
  const items = getClassItems(node);
  return (
    <div class={gtw("docItems")}>
      {decorators && <DecoratorsDoc>{decorators}</DecoratorsDoc>}
      <TypeParamsDoc location={location}>{typeParams}</TypeParamsDoc>
      <ExtendsDoc typeArgs={superTypeParams} location={location}>
        {ext}
      </ExtendsDoc>
      <ImplementsDoc location={location}>{impl}</ImplementsDoc>
      <ConstructorsDoc name={name}>{constructors}</ConstructorsDoc>
      <IndexSignaturesDoc>{indexSignatures}</IndexSignaturesDoc>
      <ClassItemsDoc>{items}</ClassItemsDoc>
    </div>
  );
}

export function ClassToc({ children }: { children: Child<DocNodeClass> }) {
  const node = take(children);
  const {
    name,
    classDef: {
      constructors,
      decorators,
      indexSignatures,
      typeParams,
      extends: ext,
      implements: impl,
    },
  } = node;
  const items = getClassItems(node);
  const links = [...items.reduce(
    (set, item) => set.add(getClassItemLabel(getClassItemType(item))),
    new Set<string>(),
  )].map((label) => <TocLink>{label}</TocLink>);
  return (
    <div>
      <h3 class={gtw("tocHeader")}>{name}</h3>
      <ul>
        {decorators ? <TocLink>Decorators</TocLink> : undefined}
        {typeParams.length ? <TocLink>Type Parameters</TocLink> : undefined}
        {ext && <TocLink>Extends</TocLink>}
        {impl.length ? <TocLink>Implements</TocLink> : undefined}
        {constructors.length ? <TocLink>Constructors</TocLink> : undefined}
        {indexSignatures.length
          ? <TocLink>Index Signatures</TocLink>
          : undefined}
        {links}
      </ul>
    </div>
  );
}
