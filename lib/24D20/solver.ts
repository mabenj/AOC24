import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS = [
    [0, -1], // North
    [1, 0], // East
    [0, 1], // South
    [-1, 0], // West
];

const EXAMPLE = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`;

type Node = {
    id: string;
    x: number;
    y: number;
    type: "#" | ".";
};
type AdjacencyList = Map<string, Node[]>;
type Shortcut = {
    start: Node;
    end: Node;
    size: number;
};

export default class Solver24D20 implements PuzzleSolver {
    private adjacencyList: AdjacencyList = new Map();
    private track: Node[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        const grid = input
            .filter((line) => !!line)
            .map((line) => line.split(""));

        const getNode = (x: number, y: number): Node | null => {
            const char = grid[y]?.[x];
            if (!char) return null;
            const id = `${x},${y}`;
            return { id, x, y, type: char !== "#" ? "." : "#" };
        };

        // Build adjacency list
        let start: Node | undefined;
        let end: Node | undefined;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const current = getNode(x, y)!;
                const neighbors: Node[] = [];
                for (const [dx, dy] of DIRECTIONS) {
                    const neighbor = getNode(x + dx, y + dy);
                    if (neighbor) neighbors.push(neighbor);
                }
                this.adjacencyList.set(current.id, neighbors);

                if (grid[y][x] === "S") start = current;
                if (grid[y][x] === "E") end = current;
            }
        }

        if (!start || !end) throw new Error("Start or end not found");

        // Discover track
        let prev: Node | null = null;
        let current = start;
        while (this.track.at(-1)?.id !== end.id) {
            this.track.push(current);
            const neighbors = this.adjacencyList.get(current.id)!;
            const next = neighbors.find(
                (node) => node.id !== prev?.id && node.type === "."
            )!;
            prev = current;
            current = next;
        }
    }

    solvePart1() {
        const getShortcuts = (node: Node): Shortcut[] => {
            const startIdx = this.track.findIndex(({ id }) => id === node.id);
            const walls = this.adjacencyList
                .get(node.id)!
                .filter((neighbor) => neighbor.type === "#");
            const shortcuts: { [endId: string]: Shortcut } = {};
            for (const wall of walls) {
                const validExits = this.adjacencyList
                    .get(wall.id)!
                    .filter(
                        (neighbor) =>
                            neighbor.id !== node.id && neighbor.type === "."
                    );
                const potentialShortcuts = validExits
                    .map((exit) => {
                        const exitIdx = this.track.findIndex(
                            ({ id }) => id === exit.id
                        );
                        return {
                            start: node,
                            end: exit,
                            size: exitIdx - startIdx,
                        };
                    })
                    .filter(({ size }) => size > 0);
                const bestShortcut = potentialShortcuts.reduce(
                    (best, current) => {
                        return best.size > current.size ? best : current;
                    },
                    potentialShortcuts[0]
                );
                if (bestShortcut) shortcuts[bestShortcut.end.id] = bestShortcut;
            }
            return Object.values(shortcuts);
        };

        const allShortcuts = this.track.flatMap(getShortcuts);
        return allShortcuts.filter(({ size }) => size - 2 >= 100).length;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}
