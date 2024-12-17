import { objectKeys } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

type Graph = { [from: Node]: { [to: Node]: number } };
type Node = `${number},${number},${Direction}`;
type Direction = "N" | "S" | "W" | "E";
type PathNode = {
    node: Node;
    prev: PathNode[] | null;
};

export default class Solver24D16 implements PuzzleSolver {
    private graph: Graph = {};
    private startNode: Node = "-1,-1,E";
    private endNodes: Node[] = [];

    parseInput(input: string[]) {
        const grid = input.filter((line) => !!line).map((row) => row.split(""));

        const setGraph = (from: Node, to: Node, weight: number) => {
            this.graph[from] ??= {};
            this.graph[from][to] = weight;
        };

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === "#") {
                    continue;
                }

                const canGoNorth = grid[y - 1][x] !== "#";
                const canGoSouth = grid[y + 1][x] !== "#";
                const canGoWest = grid[y][x - 1] !== "#";
                const canGoEast = grid[y][x + 1] !== "#";

                if (grid[y][x] === "S") {
                    this.startNode = `${x},${y},E`;
                }
                if (grid[y][x] === "E") {
                    if (canGoNorth) this.endNodes.push(`${x},${y},S`);
                    if (canGoSouth) this.endNodes.push(`${x},${y},N`);
                    if (canGoWest) this.endNodes.push(`${x},${y},E`);
                    if (canGoEast) this.endNodes.push(`${x},${y},W`);
                }

                if (canGoNorth) {
                    setGraph(`${x},${y},N`, `${x},${y - 1},N`, 1);
                    setGraph(`${x},${y},E`, `${x},${y},N`, 1000);
                    setGraph(`${x},${y},W`, `${x},${y},N`, 1000);
                }
                if (canGoSouth) {
                    setGraph(`${x},${y},S`, `${x},${y + 1},S`, 1);
                    setGraph(`${x},${y},E`, `${x},${y},S`, 1000);
                    setGraph(`${x},${y},W`, `${x},${y},S`, 1000);
                }
                if (canGoWest) {
                    setGraph(`${x},${y},W`, `${x - 1},${y},W`, 1);
                    setGraph(`${x},${y},N`, `${x},${y},W`, 1000);
                    setGraph(`${x},${y},S`, `${x},${y},W`, 1000);
                }
                if (canGoEast) {
                    setGraph(`${x},${y},E`, `${x + 1},${y},E`, 1);
                    setGraph(`${x},${y},N`, `${x},${y},E`, 1000);
                    setGraph(`${x},${y},S`, `${x},${y},E`, 1000);
                }
            }
        }
    }

    solvePart1() {
        const { distance } = dijkstra(
            this.graph,
            this.startNode,
            this.endNodes,
            false
        );
        return distance;
    }

    solvePart2() {
        const { paths } = dijkstra(
            this.graph,
            this.startNode,
            this.endNodes,
            true
        );
        const uniqueSeats = new Set<string>();
        for (const path of paths) {
            for (const node of path) {
                const [x, y] = node.split(",");
                uniqueSeats.add(`${x},${y}`);
            }
        }
        return uniqueSeats.size;
    }
}

function dijkstra(
    graph: Graph,
    startNode: Node,
    endNodes: Node[],
    getPaths: boolean
) {
    const distances: { [node: Node]: number } = {};
    const paths: { [node: Node]: PathNode } = {};
    const priorityQueue: { node: Node; distance: number }[] = [];

    objectKeys(graph).forEach((node) => {
        distances[node] = Infinity;
    });
    distances[startNode] = 0;
    paths[startNode] = { node: startNode, prev: null };

    priorityQueue.push({ node: startNode, distance: 0 });

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { node: u } = priorityQueue.shift()!;

        const neighbors = objectKeys(graph[u]);
        for (const v of neighbors) {
            const alt = distances[u] + graph[u][v];

            if (alt < distances[v]) {
                distances[v] = alt;
                paths[v] = { node: v, prev: [paths[u]] };
                priorityQueue.push({ node: v, distance: alt });
            } else if (alt === distances[v]) {
                paths[v].prev!.push(paths[u]);
            }
        }
    }

    const minDistance = Math.min(...endNodes.map((node) => distances[node]));
    const bestPaths: Array<Node[]> = [];
    if (getPaths) {
        endNodes.forEach((node) => {
            if (distances[node] !== minDistance) {
                return;
            }
            constructPath(paths[node], []).forEach((path) => {
                bestPaths.push(path);
            });
        });
    }
    return {
        distance: minDistance,
        paths: bestPaths,
    };
}

function constructPath(lastNode: PathNode, pathSoFar: Node[]): Node[][] {
    if (!lastNode.prev) {
        return [[lastNode.node, ...pathSoFar]];
    }

    const paths: Node[][] = [];
    for (const prevNode of lastNode.prev) {
        paths.push(...constructPath(prevNode, [lastNode.node, ...pathSoFar]));
    }
    return paths;
}
