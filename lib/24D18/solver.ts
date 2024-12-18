import { PuzzleSolver } from "../types/puzzle-solver.ts";

const WIDTH = 70;
const HEIGHT = 70;
const OBSTACLE_COUNT = 1024;
const START: Node = `${0},${0}`;
const END: Node = `${WIDTH},${HEIGHT}`;

type Graph = Map<Node, Node[]>;
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
        const graph = buildGraph(this.obstacles.slice(0, OBSTACLE_COUNT));
        const distance = bfs(graph, START, END);
        return distance;
    }

    solvePart2() {
        let leftIdx = OBSTACLE_COUNT + 1;
        let rightIdx = this.obstacles.length - 1;
        let boundary: Node = `${0},${0}`;
        while (leftIdx <= rightIdx) {
            const midIdx = Math.floor(leftIdx + (rightIdx - leftIdx) / 2);
            const graph = buildGraph(this.obstacles.slice(0, midIdx + 1));
            const distance = bfs(graph, START, END);
            if (distance === Infinity) {
                boundary = this.obstacles[midIdx];
                rightIdx = midIdx - 1;
            } else {
                leftIdx = midIdx + 1;
            }
        }
        return boundary;
    }
}

function bfs(graph: Graph, start: Node, end: Node) {
    const visited = new Set([start]);
    const queue: { node: Node; distance: number }[] = [
        { node: start, distance: 0 },
    ];

    while (queue.length > 0) {
        const { node, distance } = queue.shift()!;
        if (node === end) {
            return distance;
        }
        const neighbors = graph.get(node)!;
        for (const neighbor of neighbors) {
            if (visited.has(neighbor)) {
                continue;
            }
            visited.add(neighbor);
            queue.push({ node: neighbor, distance: distance + 1 });
        }
    }
    return Infinity;
}

function buildGraph(obstacles: Node[]) {
    const obstacleSet = new Set(obstacles);
    const graph: Graph = new Map();
    for (let x = 0; x <= WIDTH; x++) {
        for (let y = 0; y <= HEIGHT; y++) {
            const node: Node = `${x},${y}`;
            if (obstacleSet.has(node)) {
                continue;
            }
            graph.set(node, []);

            const north: Node = `${x},${y - 1}`;
            const south: Node = `${x},${y + 1}`;
            const west: Node = `${x - 1},${y}`;
            const east: Node = `${x + 1},${y}`;
            if (!obstacleSet.has(north) && y > 0) {
                graph.get(node)!.push(north);
            }
            if (!obstacleSet.has(south) && y < HEIGHT) {
                graph.get(node)!.push(south);
            }
            if (!obstacleSet.has(west) && x > 0) {
                graph.get(node)!.push(west);
            }
            if (!obstacleSet.has(east) && x < WIDTH) {
                graph.get(node)!.push(east);
            }
        }
    }

    return graph;
}
