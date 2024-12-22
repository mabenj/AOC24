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
        const { adjacencyList } = buildAdjacencyList(NUMPAD);
        let sum = 0;
        for (const code of this.codes) {
            const complexity = calculateComplexity(adjacencyList, code);
            sum += complexity;
        }
        return sum;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

function calculateComplexity(
    adjList: { [symbol: string]: string[] },
    code: string
) {
    const robot4 = new Robot(DIRPAD); // robot4 is "us" and operates robot3
    const robot3 = new Robot(DIRPAD, robot4); // robot3 operates robot2
    const robot2 = new Robot(DIRPAD, robot3); // robot2 operates robot1
    const robot1 = new Robot(NUMPAD, robot2); // robot1 operates the actual numpad

    let bestBath: string[] | null = null;
    for (let i = 1; i < code.length; i++) {
        const prev = code[i - 1];
        const next = code[i];
        const paths = findAllPaths(adjList, prev, next);
        for (const path of paths) {
            // This is fucked, you are not supposed to press A after each symbol
            // robot1.reset();
            // for (const symbol of path) {
            //     robot1.pressButton(symbol);
            // }
            // if (
            //     bestBath === null ||
            //     robot4.buttonPressHistory.length < bestBath.length
            // ) {
            //     bestBath = robot4.buttonPressHistory;
            // }
        }
    }
    const complexity = bestBath!.length * parseInt(code);
    // console.log(
    //     `Code: ${code} => ${bestBath?.length} * ${parseInt(
    //         code
    //     )} [${bestBath?.join("")}] }`
    // );
    // console.log("--------------------");
    return complexity;
}

class Robot {
    private adjacencyList: { [symbol: string]: string[] };
    private symbolCoordinates: { [symbol: string]: { x: number; y: number } };
    private puppeteer: Robot | null;
    private buttonHistory: string[];
    private currentSymbol = "A";

    constructor(pad: (string | null)[][], puppeteer: Robot | null = null) {
        this.puppeteer = puppeteer;
        this.buttonHistory = [];
        const { adjacencyList, symbolCoordinates } = buildAdjacencyList(pad);
        this.adjacencyList = adjacencyList;
        this.symbolCoordinates = symbolCoordinates;
    }

    get buttonPressHistory() {
        return this.buttonHistory;
    }

    reset() {
        this.buttonHistory = [];
        this.currentSymbol = "A";
        this.puppeteer?.reset();
    }

    pressButton(button: string) {
        const path = this.getShortestPathTo(button);
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

    private getShortestPathTo(targetSymbol: string): string[] {
        const start = this.currentSymbol;
        const visited = new Set<string>([start]);
        const queue: { symbol: string; distance: number }[] = [
            { symbol: start, distance: 0 },
        ];
        const previous: { [symbol: string]: string | null } = { [start]: null };

        while (queue.length > 0) {
            let { symbol, distance } = queue.shift()!;
            if (symbol === targetSymbol) {
                const path = [symbol];
                while (previous[symbol]) {
                    symbol = previous[symbol]!;
                    path.unshift(symbol);
                }
                return path;
            }

            const neighbors = this.adjacencyList[symbol];
            for (const neighbor of neighbors) {
                if (visited.has(neighbor)) {
                    continue;
                }
                visited.add(neighbor);
                queue.push({ symbol: neighbor, distance: distance + 1 });
                previous[neighbor] = symbol;
            }
        }

        throw new Error(`No path found: ${start} -> ${targetSymbol}`);
    }
}

function buildAdjacencyList(pad: (string | null)[][]) {
    const adjacencyList: { [symbol: string]: string[] } = {};
    const symbolCoordinates: { [symbol: string]: { x: number; y: number } } =
        {};
    for (let y = 0; y < pad.length; y++) {
        for (let x = 0; x < pad[y].length; x++) {
            const symbol = pad[y][x];
            if (symbol === null) continue;
            symbolCoordinates[symbol] = { x, y };
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
    return { adjacencyList, symbolCoordinates };
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
