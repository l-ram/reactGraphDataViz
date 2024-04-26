import { ILinks, INodes, SPARQLQuerySelectResultsJSON } from "./types/types";

export const SPARQLToD3 = (sparqlQuery: SPARQLQuerySelectResultsJSON) => {
  const nodes: INodes[] = [];
  const links: ILinks[] = [];
  const nodeMap = new Map<string, INodes>();

  sparqlQuery.results.bindings.forEach(() => {});

  return;
};
