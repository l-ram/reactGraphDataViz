// import woodyAllen from "./assets/woodyAllen.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import UseGetSPARQL from "../hooks/UseGetSPARQL";
import {
  D3ForceGraph,
  ILinks,
  INodes,
  SPARQLQuerySelectResultsJSON,
} from "../types/types";
import SPARQLtoD3 from "../hooks/UseSPARQLToD3";

interface ErrorComp {
  isError: boolean;
}

interface IsLoadingComp {
  isLoading: boolean;
}

const GraphVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [jsonData, setJsonData] = useState<SPARQLQuerySelectResultsJSON>();
  const [d3Data, setD3Data] = useState<D3ForceGraph>({
    nodes: [],
    links: [],
  });

  let nodes: INodes[] = [];
  let links: ILinks[] = [];

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
    setJsonData(data);
  }, [data]);

  const getLoadedData = async () => {
    const sparqlToD3Data = await SPARQLtoD3(jsonData);

    setD3Data(sparqlToD3Data);
  };

  getLoadedData();

  // console.log("from converter:", sparqlToD3Data);

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
