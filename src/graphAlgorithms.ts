import { D3ForceGraph } from "./types/types";

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

export const findLevelsBFS = (graph: D3ForceGraph): Map<any, any> => {
  console.log("got the graph?", graph);

  const levelMap = new Map();
  const queue = [];

  const rootNode = graph.nodes[0];

  console.log(rootNode);

  console.log(rootNode);
  levelMap.set(rootNode.key, 0);
  queue.push(rootNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    const currentLevel = levelMap.get(currentNode.key);

    const neighbours = graph.links
      .filter((link) => link.source === currentNode.key)
      .map((link) => link.target);

    neighbours.forEach((neighbourKey) => {
      if (!levelMap.has(neighbourKey)) {
        levelMap.set(neighbourKey, currentLevel + 1);
        const neighbourNode = graph.nodes.find(
          (node) => node.key === neighbourKey
        );
        queue.push(neighbourNode);
      }
    });
  }
  return levelMap;
};

// bfs("PHX");

const dfs = (start: string, visited = new Set()) => {
  console.log(start);
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

dfs("PHX");
