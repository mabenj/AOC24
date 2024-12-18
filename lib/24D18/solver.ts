import { PuzzleSolver } from "../types/puzzle-solver.ts";

const WIDTH = 70 + 1;
const HEIGHT = 70 + 1;
const COORDS_COUNT = 1024;

type Graph = Map<Node, Map<Node, number>>;
type Node = `${number},${number}`;

export default class Solver24D18 implements PuzzleSolver {
    private obstacles: Node[] = [];

    parseInput(input: string[]) {
        this.obstacles = input
            .filter((line) => !!line)
            .map((line) => {
                const [x, y] = line.split(",").map(Number);
                return `${x},${y}` as Node;
            });
    }

    solvePart1() {
        const graph = buildGraph(this.obstacles.slice(0, COORDS_COUNT));
        const distance = dijkstra(
            graph,
            `${0},${0}`,
            `${WIDTH - 1},${HEIGHT - 1}`
        );
        return distance;
    }

    solvePart2() {
        const graph = buildGraph(this.obstacles.slice(0, COORDS_COUNT));

        const deleteNodeFromGraph = (node: Node) => {
            graph.delete(node);
            graph.values().forEach((neighbors) => {
                neighbors.delete(node);
            });
        };

        for (let i = COORDS_COUNT; i < this.obstacles.length; i++) {
            deleteNodeFromGraph(this.obstacles[i]);
            const distance = dijkstra(
                graph,
                `${0},${0}`,
                `${WIDTH - 1},${HEIGHT - 1}`
            );
            if (distance === Infinity) {
                return this.obstacles[i];
            }
        }
        throw new Error("No solution found");
    }
}

function dijkstra(graph: Graph, start: Node, end: Node) {
    const distances = new Map<Node, number>();
    graph.keys().forEach((node) => distances.set(node, Infinity));
    distances.set(start, 0);
    const pq: { node: Node; distance: number }[] = [];
    pq.push({ node: start, distance: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.distance - b.distance);
        const u = pq.shift()!;
        if (u.node === end) {
            return u.distance;
        }

        const neighbors = graph.get(u.node)!.entries();
        for (const [v, distance] of neighbors) {
            const alt = distances.get(u.node)! + distance;
            if (alt < distances.get(v)!) {
                distances.set(v, alt);
                pq.push({ node: v, distance: alt });
            }
        }
    }

    return distances.get(end)!;
}

function buildGraph(obstacles: Node[]) {
    const obstacleSet = new Set(obstacles);
    const graph: Graph = new Map();
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            const node: Node = `${x},${y}`;
            if (obstacleSet.has(node)) {
                continue;
            }
            graph.set(node, new Map());

            const north: Node = `${x},${y - 1}`;
            const south: Node = `${x},${y + 1}`;
            const west: Node = `${x - 1},${y}`;
            const east: Node = `${x + 1},${y}`;
            if (!obstacleSet.has(north) && y > 0) {
                graph.get(node)!.set(north, 1);
            }
            if (!obstacleSet.has(south) && y < HEIGHT - 1) {
                graph.get(node)!.set(south, 1);
            }
            if (!obstacleSet.has(west) && x > 0) {
                graph.get(node)!.set(west, 1);
            }
            if (!obstacleSet.has(east) && x < WIDTH - 1) {
                graph.get(node)!.set(east, 1);
            }
        }
    }

    return graph;
}
