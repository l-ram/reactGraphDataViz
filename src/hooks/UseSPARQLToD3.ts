import { useState } from "react";
import { useEffect } from "react";
import {
  D3ForceGraph,
  GraphConfig,
  SPARQLQuerySelectResultsJSON,
} from "../types/types.js";

const sparql2D3Graph = (
  json: SPARQLQuerySelectResultsJSON,
  config?: GraphConfig
): D3ForceGraph => {
  config = config || {};

  const head: string[] = json.head.vars;
  const data = json.results.bindings;

  const opts = {
    key1: config.key1 || head[0] || "key1",
    key2: config.key2 || head[1] || "key2",
    label1: config.label1 || head[2] || false,
    label2: config.label2 || head[3] || false,
    value1: config.value1 || head[4] || false,
    value2: config.value2 || head[5] || false,
  };
  const graph: D3ForceGraph = {
    nodes: [],
    links: [],
  };
  const check = new Map();
  let index = 0;
  for (let i = 0; i < data.length; i++) {
    const key1 = data[i][opts.key1].value;
    const key2 = data[i][opts.key2].value;
    const label1 = opts.label1 ? data[i][opts.label1].value : key1;
    const label2 = opts.label2 ? data[i][opts.label2].value : key2;
    const value1 = opts.value1 ? data[i][opts.value1].value : false;
    const value2 = opts.value2 ? data[i][opts.value2].value : false;
    if (!check.has(key1)) {
      graph.nodes.push({ key: key1, label: label1, value: value1 });
      check.set(key1, index);
      index++;
    }
    if (!check.has(key2)) {
      graph.nodes.push({ key: key2, label: label2, value: value2 });
      check.set(key2, index);
      index++;
    }
    graph.links.push({ source: check.get(key1), target: check.get(key2) });
  }
  return graph;
};

const SPARQLtoD3 = (json: SPARQLQuerySelectResultsJSON) => {
  const [sparqlToD3Data, setSparqlToD3Data] = useState<D3ForceGraph>({
    links: [],
    nodes: [],
  });

  useEffect(() => {
    const graph = sparql2D3Graph(json);
    console.log("graph conversion result:", graph);
    setSparqlToD3Data(graph);
  }, []);

  return {
    sparqlToD3Data,
  };
};

export default SPARQLtoD3;
