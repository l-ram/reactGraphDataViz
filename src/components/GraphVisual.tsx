// import woodyAllen from "./assets/woodyAllen.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import UseGetSPARQL from "../hooks/UseGetSPARQL";
import { findLevelsBFS } from "../graphAlgorithms";
import {
  D3ForceGraph,
  GraphConfig,
  Nodes,
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
      ],
    },
  });
  const [d3Data, setD3Data] = useState<D3ForceGraph>({
    nodes: [],
    links: [],
  });

  const sparql2D3Graph = (
    json: SPARQLQuerySelectResultsJSON,
    config?: GraphConfig
  ): D3ForceGraph => {
    config = config || {};

    console.log("sparql json:", json);

    const head: string[] = json.head.vars;
    const results = json.results.bindings;

    const nodeTypeMapping: { [key: string]: string } = {};

    head.forEach((head) => {
      nodeTypeMapping[head] = head;
    });

    console.log("types:", nodeTypeMapping);

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

      const type1 = nodeTypeMapping[opts.key1] || "unknown";
      const type2 = nodeTypeMapping[opts.key2] || "unknown";

      if (!check.has(key1)) {
        graph.nodes.push({
          key: key1 as string,
          label: label1 as string,
          value: value1 as boolean,
          type: type1,
        });
        check.set(key1, index);
        index++;
      }
      if (!check.has(key2)) {
        graph.nodes.push({
          key: key2 as string,
          label: label2 as string,
          value: value2 as boolean,
          type: type2,
        });
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
  
  SELECT DISTINCT ?movie ?actor ?director
  WHERE {
      ?movie dbo:director ?director ;
            dbo:starring ?actor .
      FILTER(?director =  dbr:Woody_Allen)
  }`;

  const { data, isLoading, isError } = UseGetSPARQL(woodyAllenQuery);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const SPARQLErrorComponent: React.FC<ErrorComp> = ({ isError }) => {
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
  }, [data, jsonData]);

  // Transform Results JSON to D3 graph data
  useEffect(() => {
    if (data !== undefined) {
      setJsonData(...[data]);
    }
    sparql2D3Graph(jsonData);
  }, [data, jsonData]);

  useEffect(() => {
    if (d3Data.nodes.length == 0) {
      return;
    } else {
      const updatedNodes = findLevelsBFS(d3Data);
      setD3Data((prevState) => ({
        ...prevState,
        nodes: updatedNodes,
      }));
    }
  }, [data]);

  // D3
  useEffect(() => {
    // Visualize the graph using D3 force layout
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const g = svg.append("g");

    const colours = d3.schemeTableau10;
    const colour = d3.scaleOrdinal(colours);

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const simulation = d3
      .forceSimulation(d3Data.nodes)
      .force("link", d3.forceLink(d3Data.links))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const drag = (simulation: d3.Simulation<any, undefined>) => {
      const dragStarted = (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      };

      const dragged = (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      };

      const dragended = (event: any) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      };

      return d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const maxElementsByType = {};

    d3Data.nodes.forEach((node) => {
      if (!maxElementsByType[node.type]) {
        // If the type is encountered for the first time, initialize the count
        maxElementsByType[node.type] = node.elements.length;
      } else {
        // If the type has been encountered before, update the count if needed
        maxElementsByType[node.type] = Math.max(
          maxElementsByType[node.type],
          node.elements.length
        );
      }
    });

    console.log("max:", maxElementsByType);

    const nodeSize = (d: Nodes): Number => {
      const maxValue = d3Data.nodes.reduce((max, current) => {
        return current.type > current.type ? current : max;
      }, d3Data.nodes[0]);

      console.log("max:", maxValue);

      console.log(maxValue);

      const sizeScale = d3
        .scaleLinear()
        .domain([minValue, maxValue])
        .range([minSize, maxSize]);

      const numberOfConnections = d3Data.links.filter(
        (l) => l[d.key] === l.key
      );
    };

    const link = g
      .selectAll("line")
      .data(d3Data.links)
      .enter()
      .append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "#ccc")
      .attr("opacity", 0.5);

    const node = g
      .selectAll("circle")
      .data(d3Data.nodes)
      .enter()
      .append("circle")
      .attr("r", 8)
      .style("fill", (d) => colour(d.type))
      .join("circle")
      .attr("r", 5)
      .call(drag(simulation as any) as any);

    node.append("title").text((d) => d.key);

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
  }, [data, isLoading, d3Data]);

  console.log(d3Data);

  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {isError && <SPARQLErrorComponent isError={isError} />}

      <svg height={height} width={width} ref={svgRef} />
    </div>
  );
};

export default GraphVisual;
