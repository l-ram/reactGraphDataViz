// SPARQL

export interface SPARQLQuerySelectResultsJSON {
  head: {
    vars: string[];
    link?: string[];
  };
  results: {
    bindings: BindingObject[];
    distinct: boolean;
    ordered: boolean;
  };
}

export type BindingObject =
  | IRIObject
  | LiteralObject
  | BlankNodeObject
  | TripleObject;

export interface SPARQLQueryAskResultsJSON {
  head: {};
  boolean: true;
}

export interface IRIObject {
  [key: string]: {
    type: "uri";
    value: string;
  };
}

export interface LiteralObject {
  [key: string]: {
    type: "literal";
    value: string;
    datatype?: string;
    xmlLang?: string;
    itsDir?: string;
  };
}

export interface BlankNodeObject {
  [key: string]: {
    type: "bnode";
    value: string;
  };
}

export interface TripleObject {
  [key: string]: {
    type: "triple";
    value: {
      subject: BindingObject;
      predicate: BindingObject;
      object: BindingObject;
    };
  };
}

// D3

export interface D3ForceGraph {
  nodes: INodes[];
  links: ILinks[];
}

export interface GraphConfig {
  key1?: string;
  key2?: string;
  label1?: string | false;
  label2?: string | false;
  value1?: string | false;
  value2?: string | false;
}

export interface INodes extends NodeDatum {
  name: string;
}

export interface ILinks {
  source: INodes;
  target: INodes;
}

export interface NodeDatum {
  index?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  vx?: number | undefined;
  vy?: number | undefined;
  fx?: number | null | undefined;
  fy?: number | null | undefined;
}
