import woodyAllen from "./assets/woodyAllen.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { SimulationNodeDatum } from "d3";

interface IGraphVisual {
  prop: string;
}

interface INodes extends SimulationNodeDatum {
  index?: number | undefined;
  name: string;
}

interface ILinks {
  source: INodes;
  target: INodes;
}

interface graphData {
  nodes: INodes;
  links: ILinks[];
}

const GraphVisual = ({ prop }: IGraphVisual) => {
  prop.length;
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes: INodes[] = [];
  const links: ILinks[] = [];
  const nodeMap: Record<string, INodes> = {};

  // Iterate through the results and create nodes and links
  woodyAllen.results.bindings.forEach((result) => {
    // Extract film, actor, and actress
    const film = result.film.value;
    const filmTitle = result.filmTitle.value;
    const actor = result.actor.value;
    const actorName = result.actorName.value;
    const actress = result.actress ? result.actress.value : null;
    const actressName = result.actressName ? result.actressName.value : null;

    // Create or find the film node
    if (!nodeMap[film]) {
      const filmNode: INodes = {
        index: nodes.length,
        name: filmTitle,
      };
      nodeMap[film] = filmNode;
      nodes.push(filmNode);
    }

    // Create or find the actor node
    if (!nodeMap[actor]) {
      const actorNode: INodes = {
        index: nodes.length,
        name: actorName,
      };
      nodeMap[actor] = actorNode;
      nodes.push(actorNode);
    }

    // Add a link between the film and the actor
    links.push({ source: nodeMap[film], target: nodeMap[actor] });

    // If there's an actress, create or find the actress node
    if (actress && !nodeMap[actress]) {
      const actressNode: INodes = {
        index: nodes.length,
        name: actorName,
      };
      nodeMap[actress] = actressNode;
      nodes.push(actressNode);
      links.push({
        source: nodeMap[film],
        target: nodeMap[actress],
      });
    }
  });

  // Create the graph data structure
  const graphData = { nodes, links };
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  console.log(width);
  console.log(height);

  // Use useEffect to handle window resize events
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

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

    svg.call(zoom);

    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force(
        "link",
        d3.forceLink(graphData.links).id((d) => d.index as number)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400, 300));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc");

    const node = svg
      .append("g")
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
  }, [width, height, woodyAllen]);

  return <svg style={{ width: "100%", height: "100%" }} ref={svgRef}></svg>;
};

export default GraphVisual;
