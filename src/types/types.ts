export interface SPARQLQuerySelectResultsJSON {
  head: {
    vars: string[];
    link?: string[];
  };
  results: {
    bindings: BindingObject[];
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
