import { objectKeys } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;
// const WIDTH = 6 + 1;
// const HEIGHT = 6 + 1;
// const COORDS_COUNT = 12;
const WIDTH = 70 + 1;
const HEIGHT = 70 + 1;
const COORDS_COUNT = 1024;

type Graph = { [from: Node]: { [to: Node]: number } };
type Node = `${number},${number}`;
type Coordinate = { x: number; y: number };

export default class Solver24D18 implements PuzzleSolver {
    private coordinates: Coordinate[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        this.coordinates = input
            .filter((line) => !!line)
            .map((line) => {
                const [x, y] = line.split(",").map(Number);
                return { x, y };
            });
    }

    solvePart1() {
        const graph = buildGraph(this.coordinates.slice(0, COORDS_COUNT));
        const distance = dijkstra(
            graph,
            `${0},${0}`,
            `${WIDTH - 1},${HEIGHT - 1}`
        );
        return distance;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

function dijkstra(graph: Graph, start: Node, end: Node) {
    const distances: { [node: Node]: number } = {};
    objectKeys(graph).forEach((node) => (distances[node] = Infinity));
    distances[start] = 0;
    const pq: { node: Node; distance: number }[] = [];
    pq.push({ node: start, distance: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.distance - b.distance);
        const u = pq.shift()!;
        if (u.node === end) {
            return u.distance;
        }

        const neighbors = objectKeys(graph[u.node]);
        for (const v of neighbors) {
            const alt = distances[u.node] + graph[u.node][v];
            if (alt < distances[v]) {
                distances[v] = alt;
                pq.push({ node: v, distance: alt });
            }
        }
    }

    return distances[end];
}

function buildGraph(obstacleCoordinates: Coordinate[]) {
    const obstacleNodes = new Set(
        obstacleCoordinates.map(({ x, y }) => `${x},${y}` as Node)
    );
    const graph: Graph = {};
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            const node: Node = `${x},${y}`;
            if (obstacleNodes.has(node)) {
                continue;
            }
            graph[node] = {};

            const north: Node = `${x},${y - 1}`;
            const south: Node = `${x},${y + 1}`;
            const west: Node = `${x - 1},${y}`;
            const east: Node = `${x + 1},${y}`;
            if (!obstacleNodes.has(north) && y > 0) {
                graph[node][north] = 1;
            }
            if (!obstacleNodes.has(south) && y < HEIGHT - 1) {
                graph[node][south] = 1;
            }
            if (!obstacleNodes.has(west) && x > 0) {
                graph[node][west] = 1;
            }
            if (!obstacleNodes.has(east) && x < WIDTH - 1) {
                graph[node][east] = 1;
            }
        }
    }

    return graph;
}
