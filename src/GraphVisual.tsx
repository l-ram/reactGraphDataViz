import woodyAllen from "./assets/woodyAllen.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import UseGetSPARQL from "./UseGetSPARQL";
import {
  D3ForceGraph,
  ILinks,
  INodes,
  SPARQLQuerySelectResultsJSON,
} from "./types/types";
import SPARQLtoD3 from "./SPARQLtoD3";

interface IGraphVisual {
  prop: string;
}

const GraphVisual = ({ prop }: IGraphVisual) => {
  prop.length;
  const svgRef = useRef<SVGSVGElement>(null);

  let nodes: INodes[] = [];
  let links: ILinks[] = [];
  // const nodeMap: Record<string, INodes> = {};

  // woodyAllen.results.bindings.forEach((result) => {
  //   // Extract film, actor, and actress
  //   const film = result.film.value;
  //   const filmTitle = result.filmTitle.value;
  //   const actor = result.actor.value;
  //   const actorName = result.actorName.value;
  //   const actress = result.actress ? result.actress.value : null;
  //   // const actressName = result.actressName ? result.actressName.value : null;

  //   // Create or find the film node
  //   if (!nodeMap[film]) {
  //     const filmNode: INodes = {
  //       index: nodes.length,
  //       name: filmTitle,
  //     };
  //     nodeMap[film] = filmNode;
  //     nodes.push(filmNode);
  //   }

  //   // Create or find the actor node
  //   if (!nodeMap[actor]) {
  //     const actorNode: INodes = {
  //       index: nodes.length,
  //       name: actorName,
  //     };
  //     nodeMap[actor] = actorNode;
  //     nodes.push(actorNode);
  //   }

  //   // Add a link between the film and the actor
  //   links.push({ source: nodeMap[film], target: nodeMap[actor] });

  //   // If there's an actress, create or find the actress node
  //   if (actress && !nodeMap[actress]) {
  //     const actressNode: INodes = {
  //       index: nodes.length,
  //       name: actorName,
  //     };
  //     nodeMap[actress] = actressNode;
  //     nodes.push(actressNode);
  //     links.push({
  //       source: nodeMap[film],
  //       target: nodeMap[actress],
  //     });
  //   }
  // });

  // Create the graph data structure

  // SPARQL JSON to D3 conversion

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

  const { data, isLoading, error } = UseGetSPARQL(simpleQuery);

  // console.log("from api:", data);

  const { sparqlToD3Data } = SPARQLtoD3(data);

  // console.log("from converter:", sparqlToD3Data);

  nodes = [...sparqlToD3Data.nodes];
  links = [...sparqlToD3Data.links];

  const graphData: D3ForceGraph = { nodes, links };
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const SPARQLErrorComponent = (isError: any) => {
    if (isError) {
      return (
        <div>
          <h1>Something went wrong!</h1>
          <p>{isError.message}</p>
        </div>
      );
    } else {
      null;
    }
  };

  const SPARQLLoadingComponent = (isLoading: any) => {
    if (isLoading) {
      return (
        <div>
          <h1>LOADING</h1>
        </div>
      );
    } else {
      null;
    }
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

  // console.log("nodes:", nodes);
  // console.log("links:", links);

  return (
    <>
      <svg height={height} width={width} ref={svgRef} />
      <SPARQLErrorComponent isError={error} />
      <SPARQLLoadingComponent isLoading={isLoading} />
    </>
  );
};

export default GraphVisual;
