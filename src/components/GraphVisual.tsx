// import woodyAllen from "./assets/woodyAllen.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import UseGetSPARQL from "../hooks/UseGetSPARQL";
import {
  D3ForceGraph,
  GraphConfig,
  ILinks,
  INodes,
  SPARQLQuerySelectResultsJSON,
} from "../types/types";

interface ErrorComp {
  isError: boolean;
}

interface IsLoadingComp {
  isLoading: boolean;
}

const GraphVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [jsonData, setJsonData] = useState<SPARQLQuerySelectResultsJSON>({
    head: {
      vars: ["", ""],
      link: ["", ""],
    },
    results: {
      bindings: [
        {
          "Waiting for data": {
            type: "uri",
            value: "data",
          },
        },
      ],
      distinct: false,
      ordered: false,
    },
  });
  const [d3Data, setD3Data] = useState<D3ForceGraph>({
    nodes: [],
    links: [],
  });

  let nodes: INodes[] = [];
  let links: ILinks[] = [];

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
      const label1 =
        opts.label1 && typeof opts.label1 === "string" && data[i][opts.label1]
          ? data[i][opts.label1].value
          : key1;
      const label2 =
        opts.label2 && typeof opts.label2 === "string" && data[i][opts.label2]
          ? data[i][opts.label2].value
          : key2;
      const value1 =
        opts.value1 && typeof opts.value1 === "string" && data[i][opts.value1]
          ? data[i][opts.value1].value
          : false;
      const value2 =
        opts.value2 && typeof opts.value2 === "string" && data[i][opts.value2]
          ? data[i][opts.value2].value
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

  useEffect(() => {
    if (data) {
      setJsonData(data);
    }
    sparql2D3Graph(jsonData);
  }, [data]);

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

  console.log();

  // const SPARQLLoadingComponent: React.FC<IsLoadingComp> = ({ isLoading }) => {
  //   console.log("received loading?:", isLoading);
  //   if (isLoading) {
  //     return (
  //       <div>
  //         <h1>LOADING</h1>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

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

  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {isError && <SPARQLErrorComponent isError={isError} />}

      <svg height={height} width={width} ref={svgRef} />
    </div>
  );
};

export default GraphVisual;
