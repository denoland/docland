// Copyright 2021 the Deno authors. All rights reserved. MIT license.

export {};

declare global {
  // deno-lint-ignore no-var
  var isSSR: boolean | undefined;

  // deno-lint-ignore no-explicit-any
  type Key = string | number | any;

  export type RefObject<T> = { current: T | null };

  export type RefCallback<T> = (instance: T | null) => void;

  export type Ref<T> = RefObject<T> | RefCallback<T>;

  interface Attributes {
    // deno-lint-ignore no-explicit-any
    children?: any;
    key?: Key;
    jsx?: boolean;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }

  interface HTMLAttributes<RefType extends EventTarget = EventTarget>
    extends ClassAttributes<RefType> {
    // Standard HTML Attributes
    accept?: string;
    acceptCharset?: string;
    accessKey?: string;
    action?: string;
    allow?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    as?: string;
    async?: boolean;
    autocomplete?: string;
    autoComplete?: string;
    autocorrect?: string;
    autoCorrect?: string;
    autofocus?: boolean;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean | string;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    cite?: string;
    class?: string;
    className?: string;
    cols?: number;
    colSpan?: number;
    content?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    controls?: boolean;
    controlsList?: string;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    dir?: "auto" | "rtl" | "ltr";
    disabled?: boolean;
    disableRemotePlayback?: boolean;
    // deno-lint-ignore no-explicit-any
    download?: any;
    decoding?: "sync" | "async" | "auto";
    draggable?: boolean;
    encType?: string;
    enterkeyhint?:
      | "enter"
      | "done"
      | "go"
      | "next"
      | "previous"
      | "search"
      | "send";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    hidden?: boolean;
    high?: number;
    href?: string;
    hrefLang?: string;
    innerHTML?: { __dangerousHtml: string };
    for?: string;
    htmlFor?: string;
    httpEquiv?: string;
    icon?: string;
    id?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    lang?: string;
    list?: string;
    loading?: "eager" | "lazy";
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nomodule?: boolean;
    nonce?: string;
    noValidate?: boolean;
    onclick?: string;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    ping?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    radioGroup?: string;
    readonly?: boolean;
    readOnly?: boolean;
    referrerpolicy?:
      | "no-referrer"
      | "no-referrer-when-downgrade"
      | "origin"
      | "origin-when-cross-origin"
      | "same-origin"
      | "strict-origin"
      | "strict-origin-when-cross-origin"
      | "unsafe-url";
    rel?: string;
    required?: boolean;
    reversed?: boolean;
    role?: string;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    slot?: string;
    span?: number;
    spellcheck?: boolean;
    spellCheck?: boolean;
    src?: string;
    srcset?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    style?: string;
    summary?: string;
    tabIndex?: number;
    target?: string;
    title?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    volume?: string | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;

    // Non-standard Attributes
    autocapitalize?:
      | "off"
      | "none"
      | "on"
      | "sentences"
      | "words"
      | "characters";
    autoCapitalize?:
      | "off"
      | "none"
      | "on"
      | "sentences"
      | "words"
      | "characters";
    disablePictureInPicture?: boolean;
    results?: number;
    translate?: "yes" | "no";

    // RDFa Attributes
    about?: string;
    datatype?: string;
    // deno-lint-ignore no-explicit-any
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Microdata Attributes
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
  }

  interface SVGAttributes<Target extends EventTarget = SVGElement>
    extends HTMLAttributes<Target> {
    accentHeight?: number | string;
    accumulate?: "none" | "sum";
    additive?: "replace" | "sum";
    alignmentBaseline?:
      | "auto"
      | "baseline"
      | "before-edge"
      | "text-before-edge"
      | "middle"
      | "central"
      | "after-edge"
      | "text-after-edge"
      | "ideographic"
      | "alphabetic"
      | "hanging"
      | "mathematical"
      | "inherit";
    allowReorder?: "no" | "yes";
    alphabetic?: number | string;
    amplitude?: number | string;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated";
    ascent?: number | string;
    attributeName?: string;
    attributeType?: string;
    autoReverse?: number | string;
    azimuth?: number | string;
    baseFrequency?: number | string;
    baselineShift?: number | string;
    baseProfile?: number | string;
    bbox?: number | string;
    begin?: number | string;
    bias?: number | string;
    by?: number | string;
    calcMode?: number | string;
    capHeight?: number | string;
    clip?: number | string;
    clipPath?: string;
    clipPathUnits?: number | string;
    clipRule?: number | string;
    colorInterpolation?: number | string;
    colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
    colorProfile?: number | string;
    colorRendering?: number | string;
    contentScriptType?: number | string;
    contentStyleType?: number | string;
    cursor?: number | string;
    cx?: number | string;
    cy?: number | string;
    d?: string;
    decelerate?: number | string;
    descent?: number | string;
    diffuseConstant?: number | string;
    direction?: number | string;
    display?: number | string;
    divisor?: number | string;
    dominantBaseline?: number | string;
    dur?: number | string;
    dx?: number | string;
    dy?: number | string;
    edgeMode?: number | string;
    elevation?: number | string;
    enableBackground?: number | string;
    end?: number | string;
    exponent?: number | string;
    externalResourcesRequired?: number | string;
    fill?: string;
    fillOpacity?: number | string;
    fillRule?: "nonzero" | "evenodd" | "inherit";
    filter?: string;
    filterRes?: number | string;
    filterUnits?: number | string;
    floodColor?: number | string;
    floodOpacity?: number | string;
    focusable?: number | string;
    fontFamily?: string;
    fontSize?: number | string;
    fontSizeAdjust?: number | string;
    fontStretch?: number | string;
    fontStyle?: number | string;
    fontVariant?: number | string;
    fontWeight?: number | string;
    format?: number | string;
    from?: number | string;
    fx?: number | string;
    fy?: number | string;
    g1?: number | string;
    g2?: number | string;
    glyphName?: number | string;
    glyphOrientationHorizontal?: number | string;
    glyphOrientationVertical?: number | string;
    glyphRef?: number | string;
    gradientTransform?: string;
    gradientUnits?: string;
    hanging?: number | string;
    horizAdvX?: number | string;
    horizOriginX?: number | string;
    ideographic?: number | string;
    imageRendering?: number | string;
    in2?: number | string;
    in?: string;
    intercept?: number | string;
    k1?: number | string;
    k2?: number | string;
    k3?: number | string;
    k4?: number | string;
    k?: number | string;
    kernelMatrix?: number | string;
    kernelUnitLength?: number | string;
    kerning?: number | string;
    keyPoints?: number | string;
    keySplines?: number | string;
    keyTimes?: number | string;
    lengthAdjust?: number | string;
    letterSpacing?: number | string;
    lightingColor?: number | string;
    limitingConeAngle?: number | string;
    local?: number | string;
    markerEnd?: string;
    markerHeight?: number | string;
    markerMid?: string;
    markerStart?: string;
    markerUnits?: number | string;
    markerWidth?: number | string;
    mask?: string;
    maskContentUnits?: number | string;
    maskUnits?: number | string;
    mathematical?: number | string;
    mode?: number | string;
    numOctaves?: number | string;
    offset?: number | string;
    opacity?: number | string;
    operator?: number | string;
    order?: number | string;
    orient?: number | string;
    orientation?: number | string;
    origin?: number | string;
    overflow?: number | string;
    overlinePosition?: number | string;
    overlineThickness?: number | string;
    paintOrder?: number | string;
    panose1?: number | string;
    pathLength?: number | string;
    patternContentUnits?: string;
    patternTransform?: number | string;
    patternUnits?: string;
    pointerEvents?: number | string;
    points?: string;
    pointsAtX?: number | string;
    pointsAtY?: number | string;
    pointsAtZ?: number | string;
    preserveAlpha?: number | string;
    preserveAspectRatio?: string;
    primitiveUnits?: number | string;
    r?: number | string;
    radius?: number | string;
    refX?: number | string;
    refY?: number | string;
    renderingIntent?: number | string;
    repeatCount?: number | string;
    repeatDur?: number | string;
    requiredExtensions?: number | string;
    requiredFeatures?: number | string;
    restart?: number | string;
    result?: string;
    rotate?: number | string;
    rx?: number | string;
    ry?: number | string;
    scale?: number | string;
    seed?: number | string;
    shapeRendering?: number | string;
    slope?: number | string;
    spacing?: number | string;
    specularConstant?: number | string;
    specularExponent?: number | string;
    speed?: number | string;
    spreadMethod?: string;
    startOffset?: number | string;
    stdDeviation?: number | string;
    stemh?: number | string;
    stemv?: number | string;
    stitchTiles?: number | string;
    stopColor?: string;
    stopOpacity?: number | string;
    strikethroughPosition?: number | string;
    strikethroughThickness?: number | string;
    string?: number | string;
    stroke?: string;
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeLinecap?: "butt" | "round" | "square" | "inherit";
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
    strokeMiterlimit?: string | number;
    strokeOpacity?: number | string;
    strokeWidth?: number | string;
    surfaceScale?: number | string;
    systemLanguage?: number | string;
    tableValues?: number | string;
    targetX?: number | string;
    targetY?: number | string;
    textAnchor?: string;
    textDecoration?: number | string;
    textLength?: number | string;
    textRendering?: number | string;
    to?: number | string;
    transform?: string;
    u1?: number | string;
    u2?: number | string;
    underlinePosition?: number | string;
    underlineThickness?: number | string;
    unicode?: number | string;
    unicodeBidi?: number | string;
    unicodeRange?: number | string;
    unitsPerEm?: number | string;
    vAlphabetic?: number | string;
    values?: string;
    vectorEffect?: number | string;
    version?: string;
    vertAdvY?: number | string;
    vertOriginX?: number | string;
    vertOriginY?: number | string;
    vHanging?: number | string;
    vIdeographic?: number | string;
    viewBox?: string;
    viewTarget?: number | string;
    visibility?: number | string;
    vMathematical?: number | string;
    widths?: number | string;
    wordSpacing?: number | string;
    writingMode?: number | string;
    x1?: number | string;
    x2?: number | string;
    x?: number | string;
    xChannelSelector?: string;
    xHeight?: number | string;
    xlinkActuate?: string;
    xlinkArcrole?: string;
    xlinkHref?: string;
    xlinkRole?: string;
    xlinkShow?: string;
    xlinkTitle?: string;
    xlinkType?: string;
    xmlBase?: string;
    xmlLang?: string;
    xmlns?: string;
    xmlnsXlink?: string;
    xmlSpace?: string;
    y1?: number | string;
    y2?: number | string;
    y?: number | string;
    yChannelSelector?: string;
    z?: number | string;
    zoomAndPan?: string;
  }

  namespace JSX {
    interface IntrinsicElements {
      // HTML
      a: HTMLAttributes<HTMLAnchorElement>;
      abbr: HTMLAttributes<HTMLElement>;
      address: HTMLAttributes<HTMLElement>;
      area: HTMLAttributes<HTMLAreaElement>;
      article: HTMLAttributes<HTMLElement>;
      aside: HTMLAttributes<HTMLElement>;
      audio: HTMLAttributes<HTMLAudioElement>;
      b: HTMLAttributes<HTMLElement>;
      base: HTMLAttributes<HTMLBaseElement>;
      bdi: HTMLAttributes<HTMLElement>;
      bdo: HTMLAttributes<HTMLElement>;
      big: HTMLAttributes<HTMLElement>;
      blockquote: HTMLAttributes<HTMLQuoteElement>;
      body: HTMLAttributes<HTMLBodyElement>;
      br: HTMLAttributes<HTMLBRElement>;
      button: HTMLAttributes<HTMLButtonElement>;
      canvas: HTMLAttributes<HTMLCanvasElement>;
      caption: HTMLAttributes<HTMLTableCaptionElement>;
      cite: HTMLAttributes<HTMLElement>;
      code: HTMLAttributes<HTMLElement>;
      col: HTMLAttributes<HTMLTableColElement>;
      colgroup: HTMLAttributes<HTMLTableColElement>;
      data: HTMLAttributes<HTMLDataElement>;
      datalist: HTMLAttributes<HTMLDataListElement>;
      dd: HTMLAttributes<HTMLElement>;
      del: HTMLAttributes<HTMLModElement>;
      details: HTMLAttributes<HTMLDetailsElement>;
      dfn: HTMLAttributes<HTMLElement>;
      dialog: HTMLAttributes<HTMLDialogElement>;
      div: HTMLAttributes<HTMLDivElement>;
      dl: HTMLAttributes<HTMLDListElement>;
      dt: HTMLAttributes<HTMLElement>;
      em: HTMLAttributes<HTMLElement>;
      embed: HTMLAttributes<HTMLEmbedElement>;
      fieldset: HTMLAttributes<HTMLFieldSetElement>;
      figcaption: HTMLAttributes<HTMLElement>;
      figure: HTMLAttributes<HTMLElement>;
      footer: HTMLAttributes<HTMLElement>;
      form: HTMLAttributes<HTMLFormElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
      h2: HTMLAttributes<HTMLHeadingElement>;
      h3: HTMLAttributes<HTMLHeadingElement>;
      h4: HTMLAttributes<HTMLHeadingElement>;
      h5: HTMLAttributes<HTMLHeadingElement>;
      h6: HTMLAttributes<HTMLHeadingElement>;
      head: HTMLAttributes<HTMLHeadElement>;
      header: HTMLAttributes<HTMLElement>;
      hgroup: HTMLAttributes<HTMLElement>;
      hr: HTMLAttributes<HTMLHRElement>;
      html: HTMLAttributes<HTMLHtmlElement>;
      i: HTMLAttributes<HTMLElement>;
      iframe: HTMLAttributes<HTMLIFrameElement>;
      img: HTMLAttributes<HTMLImageElement>;
      input: HTMLAttributes<HTMLInputElement>;
      ins: HTMLAttributes<HTMLModElement>;
      kbd: HTMLAttributes<HTMLElement>;
      keygen: HTMLAttributes<HTMLUnknownElement>;
      label: HTMLAttributes<HTMLLabelElement>;
      legend: HTMLAttributes<HTMLLegendElement>;
      li: HTMLAttributes<HTMLLIElement>;
      link: HTMLAttributes<HTMLLinkElement>;
      main: HTMLAttributes<HTMLElement>;
      map: HTMLAttributes<HTMLMapElement>;
      mark: HTMLAttributes<HTMLElement>;
      marquee: HTMLAttributes<HTMLMarqueeElement>;
      menu: HTMLAttributes<HTMLMenuElement>;
      menuitem: HTMLAttributes<HTMLUnknownElement>;
      meta: HTMLAttributes<HTMLMetaElement>;
      meter: HTMLAttributes<HTMLMeterElement>;
      nav: HTMLAttributes<HTMLElement>;
      noscript: HTMLAttributes<HTMLElement>;
      object: HTMLAttributes<HTMLObjectElement>;
      ol: HTMLAttributes<HTMLOListElement>;
      optgroup: HTMLAttributes<HTMLOptGroupElement>;
      option: HTMLAttributes<HTMLOptionElement>;
      output: HTMLAttributes<HTMLOutputElement>;
      p: HTMLAttributes<HTMLParagraphElement>;
      param: HTMLAttributes<HTMLParamElement>;
      picture: HTMLAttributes<HTMLPictureElement>;
      pre: HTMLAttributes<HTMLPreElement>;
      progress: HTMLAttributes<HTMLProgressElement>;
      q: HTMLAttributes<HTMLQuoteElement>;
      rp: HTMLAttributes<HTMLElement>;
      rt: HTMLAttributes<HTMLElement>;
      ruby: HTMLAttributes<HTMLElement>;
      s: HTMLAttributes<HTMLElement>;
      samp: HTMLAttributes<HTMLElement>;
      script: HTMLAttributes<HTMLScriptElement>;
      section: HTMLAttributes<HTMLElement>;
      select: HTMLAttributes<HTMLSelectElement>;
      slot: HTMLAttributes<HTMLSlotElement>;
      small: HTMLAttributes<HTMLElement>;
      source: HTMLAttributes<HTMLSourceElement>;
      span: HTMLAttributes<HTMLSpanElement>;
      strong: HTMLAttributes<HTMLElement>;
      style: HTMLAttributes<HTMLStyleElement>;
      sub: HTMLAttributes<HTMLElement>;
      summary: HTMLAttributes<HTMLElement>;
      sup: HTMLAttributes<HTMLElement>;
      table: HTMLAttributes<HTMLTableElement>;
      tbody: HTMLAttributes<HTMLTableSectionElement>;
      td: HTMLAttributes<HTMLTableCellElement>;
      textarea: HTMLAttributes<HTMLTextAreaElement>;
      tfoot: HTMLAttributes<HTMLTableSectionElement>;
      th: HTMLAttributes<HTMLTableCellElement>;
      thead: HTMLAttributes<HTMLTableSectionElement>;
      time: HTMLAttributes<HTMLTimeElement>;
      title: HTMLAttributes<HTMLTitleElement>;
      tr: HTMLAttributes<HTMLTableRowElement>;
      track: HTMLAttributes<HTMLTrackElement>;
      u: HTMLAttributes<HTMLElement>;
      ul: HTMLAttributes<HTMLUListElement>;
      var: HTMLAttributes<HTMLElement>;
      video: HTMLAttributes<HTMLVideoElement>;
      wbr: HTMLAttributes<HTMLElement>;

      //SVG
      svg: SVGAttributes<SVGSVGElement>;
      animate: SVGAttributes<SVGAnimateElement>;
      circle: SVGAttributes<SVGCircleElement>;
      animateTransform: SVGAttributes<SVGAnimateElement>;
      clipPath: SVGAttributes<SVGClipPathElement>;
      defs: SVGAttributes<SVGDefsElement>;
      desc: SVGAttributes<SVGDescElement>;
      ellipse: SVGAttributes<SVGEllipseElement>;
      feBlend: SVGAttributes<SVGFEBlendElement>;
      feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>;
      feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>;
      feComposite: SVGAttributes<SVGFECompositeElement>;
      feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>;
      feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>;
      feDropShadow: SVGAttributes<SVGFEDropShadowElement>;
      feFlood: SVGAttributes<SVGFEFloodElement>;
      feFuncA: SVGAttributes<SVGFEFuncAElement>;
      feFuncB: SVGAttributes<SVGFEFuncBElement>;
      feFuncG: SVGAttributes<SVGFEFuncGElement>;
      feFuncR: SVGAttributes<SVGFEFuncRElement>;
      feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>;
      feImage: SVGAttributes<SVGFEImageElement>;
      feMerge: SVGAttributes<SVGFEMergeElement>;
      feMergeNode: SVGAttributes<SVGFEMergeNodeElement>;
      feMorphology: SVGAttributes<SVGFEMorphologyElement>;
      feOffset: SVGAttributes<SVGFEOffsetElement>;
      feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>;
      feTile: SVGAttributes<SVGFETileElement>;
      feTurbulence: SVGAttributes<SVGFETurbulenceElement>;
      filter: SVGAttributes<SVGFilterElement>;
      foreignObject: SVGAttributes<SVGForeignObjectElement>;
      g: SVGAttributes<SVGGElement>;
      image: SVGAttributes<SVGImageElement>;
      line: SVGAttributes<SVGLineElement>;
      linearGradient: SVGAttributes<SVGLinearGradientElement>;
      marker: SVGAttributes<SVGMarkerElement>;
      mask: SVGAttributes<SVGMaskElement>;
      path: SVGAttributes<SVGPathElement>;
      pattern: SVGAttributes<SVGPatternElement>;
      polygon: SVGAttributes<SVGPolygonElement>;
      polyline: SVGAttributes<SVGPolylineElement>;
      radialGradient: SVGAttributes<SVGRadialGradientElement>;
      rect: SVGAttributes<SVGRectElement>;
      stop: SVGAttributes<SVGStopElement>;
      symbol: SVGAttributes<SVGSymbolElement>;
      text: SVGAttributes<SVGTextElement>;
      tspan: SVGAttributes<SVGTSpanElement>;
      use: SVGAttributes<SVGUseElement>;
    }
    interface ElementClass {
      // deno-lint-ignore no-explicit-any
      render: any;
    }
    interface ElementChildrenAttribute {
      // deno-lint-ignore no-explicit-any
      children: any;
    }
  }

  interface URLPatternInit {
    protocol?: string;
    username?: string;
    password?: string;
    hostname?: string;
    port?: string;
    pathname?: string;
    search?: string;
    hash?: string;
    baseURL?: string;
  }

  type URLPatternInput = string | URLPatternInit;

  interface URLPatternComponentResult {
    input: string;
    groups: Record<string, string>;
  }

  /** `URLPatternResult` is the object returned from `URLPattern.exec`. */
  interface URLPatternResult {
    /** The inputs provided when matching. */
    inputs: [URLPatternInit] | [URLPatternInit, string];

    /** The matched result for the `protocol` matcher. */
    protocol: URLPatternComponentResult;
    /** The matched result for the `username` matcher. */
    username: URLPatternComponentResult;
    /** The matched result for the `password` matcher. */
    password: URLPatternComponentResult;
    /** The matched result for the `hostname` matcher. */
    hostname: URLPatternComponentResult;
    /** The matched result for the `port` matcher. */
    port: URLPatternComponentResult;
    /** The matched result for the `pathname` matcher. */
    pathname: URLPatternComponentResult;
    /** The matched result for the `search` matcher. */
    search: URLPatternComponentResult;
    /** The matched result for the `hash` matcher. */
    hash: URLPatternComponentResult;
  }

  /**
   * The URLPattern API provides a web platform primitive for matching URLs based
   * on a convenient pattern syntax.
   *
   * The syntax is based on path-to-regexp. Wildcards, named capture groups,
   * regular groups, and group modifiers are all supported.
   *
   * ```ts
   * // Specify the pattern as structured data.
   * const pattern = new URLPattern({ pathname: "/users/:user" });
   * const match = pattern.exec("/users/joe");
   * console.log(match.pathname.groups.user); // joe
   * ```
   *
   * ```ts
   * // Specify a fully qualified string pattern.
   * const pattern = new URLPattern("https://example.com/books/:id");
   * console.log(pattern.test("https://example.com/books/123")); // true
   * console.log(pattern.test("https://deno.land/books/123")); // false
   * ```
   *
   * ```ts
   * // Specify a relative string pattern with a base URL.
   * const pattern = new URLPattern("/:article", "https://blog.example.com");
   * console.log(pattern.test("https://blog.example.com/article")); // true
   * console.log(pattern.test("https://blog.example.com/article/123")); // false
   * ```
   */
  class URLPattern {
    constructor(input: URLPatternInput, baseURL?: string);

    /**
     * Test if the given input matches the stored pattern.
     *
     * The input can either be provided as a url string (with an optional base),
     * or as individual components in the form of an object.
     *
     * ```ts
     * const pattern = new URLPattern("https://example.com/books/:id");
     *
     * // Test a url string.
     * console.log(pattern.test("https://example.com/books/123")); // true
     *
     * // Test a relative url with a base.
     * console.log(pattern.test("/books/123", "https://example.com")); // true
     *
     * // Test an object of url components.
     * console.log(pattern.test({ pathname: "/books/123" })); // true
     * ```
     */
    test(input: URLPatternInput, baseURL?: string): boolean;

    /**
     * Match the given input against the stored pattern.
     *
     * The input can either be provided as a url string (with an optional base),
     * or as individual components in the form of an object.
     *
     * ```ts
     * const pattern = new URLPattern("https://example.com/books/:id");
     *
     * // Match a url string.
     * let match = pattern.exec("https://example.com/books/123");
     * console.log(match.pathname.groups.id); // 123
     *
     * // Match a relative url with a base.
     * match = pattern.exec("/books/123", "https://example.com");
     * console.log(match.pathname.groups.id); // 123
     *
     * // Match an object of url components.
     * match = pattern.exec({ pathname: "/books/123" });
     * console.log(match.pathname.groups.id); // 123
     * ```
     */
    exec(input: URLPatternInput, baseURL?: string): URLPatternResult | null;

    /** The pattern string for the `protocol`. */
    readonly protocol: string;
    /** The pattern string for the `username`. */
    readonly username: string;
    /** The pattern string for the `password`. */
    readonly password: string;
    /** The pattern string for the `hostname`. */
    readonly hostname: string;
    /** The pattern string for the `port`. */
    readonly port: string;
    /** The pattern string for the `pathname`. */
    readonly pathname: string;
    /** The pattern string for the `search`. */
    readonly search: string;
    /** The pattern string for the `hash`. */
    readonly hash: string;
  }
}
