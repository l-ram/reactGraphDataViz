// import woodyAllen from "./assets/woodyAllen.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import UseGetSPARQL from "../hooks/UseGetSPARQL";
import {
  D3ForceGraph,
  GraphConfig,
  SPARQLQuerySelectResultsJSON,
} from "../types/types";

interface ErrorComp {
  isError: boolean;
}

const GraphVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [jsonData, setJsonData] = useState<any>({
    head: {
      link: [],
      vars: [
        "lang1",
        "lang2",
        "lang1label",
        "lang2label",
        "lang1value",
        "lang2value",
        "lang1year",
        "lang2year",
      ],
    },
    results: {
      distinct: false,
      ordered: true,
      bindings: [
        {
          lang1: { type: "uri", value: "http://dbpedia.org/resource/Sather" },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/Cool_(programming_language)",
          },
          lang1label: { type: "literal", value: "Sather" },
          lang2label: { type: "literal", value: "Cool" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "30",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "24",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1990",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1996",
          },
        },
        {
          lang1: {
            type: "uri",
            value: "http://dbpedia.org/resource/Eiffel_(programming_language)",
          },
          lang2: { type: "uri", value: "http://dbpedia.org/resource/Sather" },
          lang1label: { type: "literal", value: "Eiffel" },
          lang2label: { type: "literal", value: "Sather" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "34",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "30",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1986",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1990",
          },
        },
        {
          lang1: {
            type: "uri",
            value: "http://dbpedia.org/resource/Joy_(programming_language)",
          },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/Factor_(programming_language)",
          },
          lang1label: { type: "literal", value: "Joy" },
          lang2label: { type: "literal", value: "Factor" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "19",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "17",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "2001",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "2003",
          },
        },
        {
          lang1: {
            type: "uri",
            value: "http://dbpedia.org/resource/SASL_(programming_language)",
          },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/Kent_Recursive_Calculator",
          },
          lang1label: { type: "literal", value: "SASL" },
          lang2label: { type: "literal", value: "Kent Recursive Calculator" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "48",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "39",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1972",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1981",
          },
        },
        {
          lang1: {
            type: "uri",
            value: "http://dbpedia.org/resource/FP_(programming_language)",
          },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/FL_(programming_language)",
          },
          lang1label: { type: "literal", value: "FP" },
          lang2label: { type: "literal", value: "FL" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "43",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "31",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1977",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1989",
          },
        },
        {
          lang1: {
            type: "uri",
            value: "http://dbpedia.org/resource/Lucid_(programming_language)",
          },
          lang2: { type: "uri", value: "http://dbpedia.org/resource/SISAL" },
          lang1label: { type: "literal", value: "Lucid" },
          lang2label: { type: "literal", value: "SISAL" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "44",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "37",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1976",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1983",
          },
        },
        {
          lang1: { type: "uri", value: "http://dbpedia.org/resource/SP/k" },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/Turing_(programming_language)",
          },
          lang1label: { type: "literal", value: "SP/k" },
          lang2label: { type: "literal", value: "Turing" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "46",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "38",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1974",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1982",
          },
        },
        {
          lang1: { type: "uri", value: "http://dbpedia.org/resource/SP/k" },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/Turing_(programming_language)",
          },
          lang1label: { type: "literal", value: "SP/k" },
          lang2label: { type: "literal", value: "Turing" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "46",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "33",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1974",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1987",
          },
        },
        {
          lang1: { type: "uri", value: "http://dbpedia.org/resource/SP/k" },
          lang2: {
            type: "uri",
            value: "http://dbpedia.org/resource/Turing_(programming_language)",
          },
          lang1label: { type: "literal", value: "SP/k" },
          lang2label: { type: "literal", value: "Turing" },
          lang1value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "46",
          },
          lang2value: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "29",
          },
          lang1year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1974",
          },
          lang2year: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: "1991",
          },
        },
      ],
    },
  });
  const [d3Data, setD3Data] = useState<D3ForceGraph>({
    nodes: [],
    links: [],
  });

  let nodes = [];
  let links = [];

  // ts-
  const sparql2D3Graph = (
    json: SPARQLQuerySelectResultsJSON,
    config?: GraphConfig
  ): D3ForceGraph => {
    config = config || {};

    const head: string[] = json.head.vars;
    const results = json.results.bindings;

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
    for (let i = 0; i < results.length; i++) {
      const key1 = results[i][opts.key1].value;
      const key2 = results[i][opts.key2].value;
      const label1 =
        opts.label1 &&
        typeof opts.label1 === "string" &&
        results[i][opts.label1]
          ? results[i][opts.label1].value
          : key1;
      const label2 =
        opts.label2 &&
        typeof opts.label2 === "string" &&
        results[i][opts.label2]
          ? results[i][opts.label2].value
          : key2;
      const value1 =
        opts.value1 &&
        typeof opts.value1 === "string" &&
        results[i][opts.value1]
          ? results[i][opts.value1].value
          : false;
      const value2 =
        opts.value2 &&
        typeof opts.value2 === "string" &&
        results[i][opts.value2]
          ? results[i][opts.value2].value
          : false;

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
    setD3Data(graph);
    return graph;
  };

  const simpleQuery: string = `
  # https://en.wikipedia.org/wiki/History_of_programming_languages
# https://en.wikipedia.org/wiki/Perl
# http://dbpedia.org/page/Perl
# http://dbpedia.org/sparql

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX dbpedia: <http://dbpedia.org/resource/>

SELECT DISTINCT ?lang1 ?lang2 ?lang1label ?lang2label ?lang1value ?lang2value ?lang1year ?lang2year
WHERE {
  ?lang1 rdf:type dbpedia-owl:ProgrammingLanguage ;
         rdfs:label ?lang1name ;
         dbpprop:year ?lang1year .
  ?lang2 rdf:type dbpedia-owl:ProgrammingLanguage ;
         rdfs:label ?lang2name ;
         dbpprop:year ?lang2year .
  ?lang1 dbpedia-owl:influenced ?lang2 .
  FILTER (?lang1 != ?lang2)
  FILTER (LANG(?lang1name) = 'en')
  FILTER (LANG(?lang2name) = 'en')
  BIND (replace(?lang1name, " .programming language.", "") AS ?lang1label)
  BIND (replace(?lang2name, " .programming language.", "") AS ?lang2label)
  FILTER (?lang1year > 1950 AND ?lang1year < 2020)
  FILTER (?lang2year > 1950 AND ?lang2year < 2020)

  BIND ((2020 - ?lang1year) AS ?lang1value)
  BIND ((2020 - ?lang2year) AS ?lang2value)
}
      `;

  const woodyAllenQuery: string = `PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbr: <http://dbpedia.org/resource/>
  PREFIX dbp: <http://dbpedia.org/property/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  
  SELECT ?movie ?actor
  WHERE {
      ?movie dbo:director dbr:Woody_Allen .
      ?movie dbo:starring ?actor .
  }`;

  const { data, isLoading, isError } = UseGetSPARQL(woodyAllenQuery);

  nodes = [...d3Data.nodes];
  links = [...d3Data.links];

  const graphData: D3ForceGraph = { nodes, links };
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const SPARQLErrorComponent: React.FC<ErrorComp> = ({ isError }) => {
    console.log("received error?:", isError);
    if (isError) {
      return (
        <div>
          <h1 style={{ color: "white" }}>Something went wrong!</h1>
        </div>
      );
    }
    return null;
  };

  // Use useEffect to handle window resize events
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // D3
  useEffect(() => {
    // Visualize the graph using D3 force layout
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force(
        "link",
        d3.forceLink(graphData.links).id((d) => d.index as number)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = g
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "#ccc");

    const node = g
      .selectAll("circle")
      .data(graphData.nodes)
      .enter()
      .append("circle")
      .attr("r", 8)
      .attr("fill", "blue");

    node.append("title").text((d) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x as number)
        .attr("y1", (d) => d.source.y as number)
        .attr("x2", (d) => d.target.x as number)
        .attr("y2", (d) => d.target.y as number);

      node.attr("cx", (d) => d.x as number).attr("cy", (d) => d.y as number);
    });

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
  }, [width, height]);

  useEffect(() => {
    if (data !== undefined) {
      setJsonData(...[data]);
    }
    sparql2D3Graph(jsonData);
  }, [data, jsonData]);

  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {isError && <SPARQLErrorComponent isError={isError} />}

      <svg height={height} width={width} ref={svgRef} />
    </div>
  );
};

export default GraphVisual;
