import { objectKeys } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

type Graph = { [from: Node]: { [to: Node]: number } };
type Node = `${number},${number},${Direction}`;
type Direction = "N" | "S" | "W" | "E";

export default class Solver24D16 implements PuzzleSolver {
    private graph: Graph = {};
    private startNode: Node = "-1,-1,E";
    private endNodes = new Set<Node>();

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        const grid = input.filter((line) => !!line).map((row) => row.split(""));

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === "#") {
                    continue;
                }
                if (grid[y][x] === "S") {
                    this.startNode = `${x},${y},E`;
                }
                if (grid[y][x] === "E") {
                    this.endNodes = new Set([
                        `${x},${y},N`,
                        `${x},${y},S`,
                        `${x},${y},W`,
                        `${x},${y},E`,
                    ] as Node[]);
                }
                this.setRotationsToGraph(x, y);
                this.setMovementsToGraph(grid, x, y);
            }
        }
    }

    solvePart1() {
        // dijkstra
        const distances: { [node: Node]: number } = {};
        const prev: { [node: Node]: Node | null } = {};
        const priorityQueue: { node: Node; distance: number }[] = [];

        objectKeys(this.graph).forEach((node) => {
            distances[node] = Infinity;
            prev[node] = null;
        });
        distances[this.startNode] = 0;

        priorityQueue.push({ node: this.startNode, distance: 0 });

        while (priorityQueue.length > 0) {
            priorityQueue.sort((a, b) => a.distance - b.distance);
            const { node: u } = priorityQueue.shift()!;
            if (this.endNodes.has(u)) {
                return distances[u];
            }

            objectKeys(this.graph[u]).forEach((v) => {
                const alt = distances[u] + this.graph[u][v];

                if (alt < distances[v]) {
                    distances[v] = alt;
                    prev[v] = u;
                    priorityQueue.push({ node: v, distance: alt });
                }
            });
        }

        throw new Error("No path found");
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }

    private setRotationsToGraph(x: number, y: number) {
        const ROTATIONS = [
            ["N", "E"],
            ["E", "S"],
            ["S", "W"],
            ["W", "N"],
        ];
        for (const [a, b] of ROTATIONS) {
            this.setGraph(
                `${x},${y},${a}` as Node,
                `${x},${y},${b}` as Node,
                1000
            );
            this.setGraph(
                `${x},${y},${b}` as Node,
                `${x},${y},${a}` as Node,
                1000
            );
        }
    }

    private setMovementsToGraph(grid: string[][], x: number, y: number) {
        if (grid[y - 1][x] !== "#") {
            this.setGraph(`${x},${y},N`, `${x},${y - 1},N`, 1);
            this.setGraph(`${x},${y - 1},S`, `${x},${y},S`, 1);
        }
        if (grid[y + 1][x] !== "#") {
            this.setGraph(`${x},${y},S`, `${x},${y + 1},S`, 1);
            this.setGraph(`${x},${y + 1},N`, `${x},${y},N`, 1);
        }
        if (grid[y][x - 1] !== "#") {
            this.setGraph(`${x},${y},W`, `${x - 1},${y},W`, 1);
            this.setGraph(`${x - 1},${y},E`, `${x},${y},E`, 1);
        }
        if (grid[y][x + 1] !== "#") {
            this.setGraph(`${x},${y},E`, `${x + 1},${y},E`, 1);
            this.setGraph(`${x + 1},${y},W`, `${x},${y},W`, 1);
        }
    }

    private setGraph(from: Node, to: Node, weight: number) {
        this.graph[from] ??= {};
        this.graph[from][to] = weight;
    }
}
