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
  nodes: Nodes[];
  links: Links[];
}

export interface Nodes extends d3.SimulationNodeDatum {
  key: string;
  label: string;
  value: boolean;
  level?: number | null;
  type: string;
}

export interface Links extends d3.SimulationLinkDatum<Nodes> {
  source: Nodes;
  target: Nodes;
}

export interface GraphConfig {
  key1?: string;
  key2?: string;
  label1?: string | false;
  label2?: string | false;
  value1?: string | false;
  value2?: string | false;
  type?: string;
}

interface Source {
  index?: number;
  key: string | number;
  label: string | number;
  value: string | number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

interface Target {
  index?: number;
  key: string | number;
  label: string | number;
  value: string | number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}
