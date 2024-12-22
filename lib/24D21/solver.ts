import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `029A
980A
179A
456A
379A`;

const NUMPAD = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [null, "0", "A"],
];

const DIRPAD = [
    [null, "^", "A"],
    ["<", "v", ">"],
];

export default class Solver24D21 implements PuzzleSolver {
    private codes: string[] = [];

    parseInput(input: string[]) {
        input = EXAMPLE.split("\n");
        this.codes = input.filter((line) => !!line);
    }

    solvePart1() {
        const adjList = buildAdjacencyList(NUMPAD);
        for (const code of this.codes) {
            for (let i = 1; i < code.length; i++) {
                const prev = code[i - 1];
                const next = code[i];
                const paths = findAllPaths(adjList, prev, next);
                console.log(`Paths from ${prev} to ${next}:`);
                for (const path of paths) {
                    console.log(path.join(" -> "));
                }
                console.log("-------------");
            }
        }

        // const robot4 = new Robot(DIRPAD); // robot4 is "us" and operates robot3
        // const robot3 = new Robot(DIRPAD, robot4); // robot3 operates robot2
        // const robot2 = new Robot(DIRPAD, robot3); // robot2 operates robot1
        // const robot1 = new Robot(NUMPAD, robot2); // robot1 operates the actual numpad
        // for (const code of this.codes.slice(0, 1)) {
        //     for (const symbol of code) {
        //         robot1.pressButton(symbol);
        //     }
        //     console.log(`${code}: ${robot4.buttonsPressed}`);
        // }
        return -1;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

class Robot {
    private adjacencyList: { [symbol: string]: string[] };
    private symbolCoordinates: { [symbol: string]: { x: number; y: number } };
    private puppeteer: Robot | null;
    private buttonHistory: string[];
    private currentSymbol = "A";

    constructor(pad: (string | null)[][], puppeteer: Robot | null = null) {
        this.puppeteer = puppeteer;
        this.adjacencyList = {};
        this.symbolCoordinates = {};
        this.buttonHistory = [];
        for (let y = 0; y < pad.length; y++) {
            for (let x = 0; x < pad[y].length; x++) {
                const symbol = pad[y][x];
                if (symbol === null) continue;
                this.symbolCoordinates[symbol] = { x, y };
                const north = pad[y - 1]?.[x];
                const south = pad[y + 1]?.[x];
                const west = pad[y]?.[x - 1];
                const east = pad[y]?.[x + 1];
                const neighbors = [north, south, west, east].filter(
                    (n) => n != null
                );
                this.adjacencyList[symbol] = neighbors;
            }
        }
    }

    get buttonsPressed() {
        return this.buttonHistory.join("");
    }

    pressButton(button: string) {
        const path = bfs(this.adjacencyList, this.currentSymbol, button);
        for (let i = 1; i < path.length; i++) {
            const prevSymbol = path[i - 1];
            const nextSymbol = path[i];
            this.puppeteer?.pressButton(
                this.resolveDirection(prevSymbol, nextSymbol)
            );
            this.puppeteer?.pressButton("A");
        }
        this.buttonHistory.push(button);
        this.currentSymbol = button;
    }

    private resolveDirection(prev: string, next: string) {
        const prevCoord = this.symbolCoordinates[prev];
        const nextCoord = this.symbolCoordinates[next];
        const dx = nextCoord.x - prevCoord.x;
        const dy = nextCoord.y - prevCoord.y;
        if (dx === 0 && dy === -1) {
            return "^";
        } else if (dx === 0 && dy === 1) {
            return "v";
        } else if (dx === -1 && dy === 0) {
            return "<";
        } else if (dx === 1 && dy === 0) {
            return ">";
        } else {
            throw new Error(`Invalid direction: ${prev} -> ${next}`);
        }
    }
}

function buildAdjacencyList(pad: (string | null)[][]) {
    const adjacencyList: { [symbol: string]: string[] } = {};
    for (let y = 0; y < pad.length; y++) {
        for (let x = 0; x < pad[y].length; x++) {
            const symbol = pad[y][x];
            if (symbol === null) continue;
            // this.symbolCoordinates[symbol] = { x, y };
            const north = pad[y - 1]?.[x];
            const south = pad[y + 1]?.[x];
            const west = pad[y]?.[x - 1];
            const east = pad[y]?.[x + 1];
            const neighbors = [north, south, west, east].filter(
                (n) => n != null
            );
            adjacencyList[symbol] = neighbors;
        }
    }
    return adjacencyList;
}

function findAllPaths(
    adjacencyList: { [symbol: string]: string[] },
    start: string,
    end: string
): string[][] {
    const allPaths: string[][] = [];

    const dfs = (curr: string, path: string[]) => {
        path.push(curr);
        if (curr === end) {
            allPaths.push([...path]);
        } else {
            for (const neighbor of adjacencyList[curr]) {
                if (path.includes(neighbor)) continue;
                dfs(neighbor, path);
            }
        }
        path.pop();
    };

    dfs(start, []);
    return allPaths;
}

function bfs(
    adjacencyList: { [symbol: string]: string[] },
    start: string,
    end: string
): string[] {
    const visited = new Set<string>([start]);
    const queue: { symbol: string; distance: number }[] = [
        { symbol: start, distance: 0 },
    ];
    const previous: { [symbol: string]: string | null } = { [start]: null };

    while (queue.length > 0) {
        let { symbol, distance } = queue.shift()!;
        if (symbol === end) {
            const path = [symbol];
            while (previous[symbol]) {
                symbol = previous[symbol]!;
                path.unshift(symbol);
            }
            return path;
        }

        const neighbors = adjacencyList[symbol];
        for (const neighbor of neighbors) {
            if (visited.has(neighbor)) {
                continue;
            }
            visited.add(neighbor);
            queue.push({ symbol: neighbor, distance: distance + 1 });
            previous[neighbor] = symbol;
        }
    }

    throw new Error(`No path found: ${start} -> ${end}`);
}
