import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

type Graph = { [from: Node]: { [to: Node]: number } };
type Node = `${number},${number}`;

export default class Solver24D16 implements PuzzleSolver {
    private graph: Graph = {};
    private startNode: Node = "-1,-1";
    private endNode: Node = "-1,-1";

    parseInput(input: string[]) {
        input = EXAMPLE.split("\n");
        const grid = input.filter((line) => !!line).map((row) => row.split(""));

        const getNeighbors = (x: number, y: number) => ({
            N: { char: grid[y - 1]?.[x] ?? "#", node: `${x},${y - 1}` as Node },
            S: { char: grid[y + 1]?.[x] ?? "#", node: `${x},${y + 1}` as Node },
            W: { char: grid[y]?.[x - 1] ?? "#", node: `${x - 1},${y}` as Node },
            E: { char: grid[y]?.[x + 1] ?? "#", node: `${x + 1},${y}` as Node },
        });

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === "#") {
                    continue;
                }
                if (grid[y][x] === "S") {
                    this.startNode = `${x},${y}`;
                }
                if (grid[y][x] === "E") {
                    this.endNode = `${x},${y}`;
                }
                const { N, E, S, W } = getNeighbors(x, y);
                const notJunction =
                    (W.char !== "#" &&
                        E.char !== "#" &&
                        N.char === "#" &&
                        S.char === "#") ||
                    (W.char === "#" &&
                        E.char === "#" &&
                        N.char !== "#" &&
                        S.char !== "#");
                if (notJunction) {
                    const current: Node = `${x},${y}`;
                    this.graph[current] ??= {};
                    const validNeighbors = [N, E, S, W].filter(
                        (dir) => dir.char !== "#"
                    );
                    for (const neighbor of validNeighbors) {
                        this.graph[current][neighbor.node] = 1;
                        this.graph[neighbor.node] ??= {};
                        this.graph[neighbor.node][current] = 1;
                    }
                } else {
                    const rotations = [
                        [W, S],
                        [W, N],
                        [N, E],
                        [E, S],
                    ];
                    const directs = [
                        [W, E],
                        [N, S],
                    ];
                    for (const [a, b] of rotations) {
                        if (a.char === "#" || b.char === "#") {
                            continue;
                        }
                        this.graph[a.node] ??= {};
                        this.graph[b.node] ??= {};
                        this.graph[a.node][b.node] = 1002; // a -> current (1) -> rotate (1000) -> b (1) = 1002
                        this.graph[b.node][a.node] = 1002; // b -> current (1) -> rotate (1000) -> a (1) = 1002
                    }
                    for (const [a, b] of directs) {
                        if (a.char === "#" || b.char === "#") {
                            continue;
                        }
                        this.graph[a.node] ??= {};
                        this.graph[b.node] ??= {};
                        this.graph[a.node][b.node] = 2; // a -> current (1) -> b (1) = 2
                        this.graph[b.node][a.node] = 2; // b -> current (1) -> a (1) = 2
                    }
                }
            }
        }
    }

    solvePart1(): number | string {
        throw new Error("Method not implemented.");
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}
