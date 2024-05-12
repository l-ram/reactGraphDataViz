import { nextTick } from "process";
import { D3ForceGraph } from "./types/types";
import { Nodes } from "./types/types";

const airports: string[] = "PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM".split(
  " "
);

const routes = [
  ["PHX", "LAX"],
  ["PHX", "JFK"],
  ["JFK", "OKC"],
  ["JFK", "HEL"],
  ["JFK", "LOS"],
  ["MEX", "LAX"],
  ["MEX", "BKK"],
  ["MEX", "LIM"],
  ["MEX", "EZE"],
  ["LIM", "BKK"],
];

const adjacencyList = new Map();

const addEdge = (origin: string, destination: string) => {
  adjacencyList.get(origin).push(destination);
  adjacencyList.get(destination).push(origin);
};

airports.forEach((airports) => {
  adjacencyList.set(airports, []);
});

routes.forEach((route) => addEdge(route[0], route[1]));

const bfs = (start: string) => {
  const visited = new Set();
  const queue = [start];

  while (queue.length > 0) {
    const airport = queue.shift();
    const destinations = adjacencyList.get(airport);

    for (const destination of destinations) {
      if (destination === "BKK") {
        console.log("Found it!");
      }

      if (!visited.has(destination)) {
        visited.add(destination);
        queue.push(destination);
        console.log(destinations);
      }
    }
  }
};

// Find all levels in a graph
export const findLevelsBFS = (graph: D3ForceGraph): Nodes[] => {
  const { nodes, links } = graph;

  nodes.forEach((node) => {
    node.level = null;
  });

  const nodeMap = new Map<number, Nodes>(
    nodes.map((node) => [node.index as number, node])
  );

  const rootNode = nodeMap.get(nodes[19].index as number);

  if (!rootNode) {
    console.error("Root node with id ${rootNode} not found");
    return nodes;
  }

  rootNode.level = 0;

  const queue = [];
  queue.push(nodes[19]);

  while (queue.length > 0) {
    const currentNode = queue.shift();

    const connectedLinks = links.filter(
      (link) =>
        link.source.key === currentNode!.key ||
        link.target.key === currentNode!.key
    );
    connectedLinks.forEach((link) => {
      const neighbourNode = nodeMap.get(link.source.index);
      if (neighbourNode?.level === null) {
        neighbourNode.level = (currentNode?.level as number) + 1;

        queue.push(neighbourNode);
      }
    });
  }
  return nodes;
};

const dfs = (start: string, visited = new Set()) => {
  visited.add(start);

  const destinations = adjacencyList.get(start);

  for (const destination of destinations) {
    let steps = visited.has.length;
    if (destination === "BKK") {
      console.log(`DFS found Bangkok ${steps} in steps`);
      return;
    }

    if (!visited.has(destination)) {
      dfs(destination, visited);
    }
  }
};

export const graphAnalysis = (graph: D3ForceGraph) => {
  const index = graph.nodes.findIndex(
    (x) =>
      x.key === "http://dbpedia.org/resource/You_Will_Meet_a_Tall_Dark_Stranger"
  );

  const foundNode = graph.nodes.find((n) => n.index === index);

  return foundNode;
};
