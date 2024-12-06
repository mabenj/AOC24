import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS = {
    "^": [0, -1],
    ">": [1, 0],
    v: [0, 1],
    "<": [-1, 0],
};

export default class Solver24D6 implements PuzzleSolver {
    private matrix: string[][] = [];

    parseInput(input: string[]) {
        this.matrix = input
            .filter((line) => !!line)
            .map((line) => line.split(""));
    }

    solvePart1() {
        const path = getGuardPath(this.matrix);
        const uniquePath = [...new Set(path.map((p) => `${p.x},${p.y}`))];
        return uniquePath.length;
    }

    solvePart2() {
        const path = getGuardPath(this.matrix);
        const obstacles = new Set<string>();
        for (let i = 0; i < path.length; i++) {
            const { x, y } = path[i];
            const char = getMatrixAt(this.matrix, x, y);
            if (isGuard(char)) {
                continue;
            }
            this.matrix = setMatrixAt(this.matrix, x, y, "#");
            if (isGuardInLoop(this.matrix)) {
                obstacles.add(`${x},${y}`);
            }
            this.matrix = setMatrixAt(this.matrix, x, y, char);
        }

        return obstacles.size;
    }
}

function isGuard(char: string) {
    return Object.keys(DIRECTIONS).includes(char);
}

function isGuardInLoop(matrix: string[][]) {
    try {
        getGuardPath(matrix);
        return false;
    } catch (e) {
        if (
            e instanceof Error &&
            e.message === "Guard is in an infinite loop"
        ) {
            return true;
        }
        throw e;
    }
}

function getGuardPath(matrix: string[][]) {
    let {
        x,
        y,
        direction: { dx, dy },
    } = locateGuard(matrix);

    const visited = new Set<string>();
    let isOutside = false;
    while (!isOutside) {
        const id = `${x},${y},${dx},${dy}`;
        if (visited.has(id)) {
            throw new Error("Guard is in an infinite loop");
        }
        visited.add(id);
        let isNextObstacle = getMatrixAt(matrix, x + dx, y + dy) === "#";
        while (isNextObstacle) {
            [dx, dy] = turnRight(dx, dy);
            isNextObstacle = getMatrixAt(matrix, x + dx, y + dy) === "#";
        }
        x += dx;
        y += dy;
        isOutside = getMatrixAt(matrix, x, y) === "";
    }

    return Array.from(visited).map((xy) => {
        const [x, y, dx, dy] = xy.split(",").map(Number);
        return { x, y, dx, dy };
    });
}

function turnRight(dx: number, dy: number) {
    const north = DIRECTIONS["^"];
    const east = DIRECTIONS[">"];
    const south = DIRECTIONS["v"];
    const west = DIRECTIONS["<"];
    if (north[0] === dx && north[1] === dy) return east;
    if (east[0] === dx && east[1] === dy) return south;
    if (south[0] === dx && south[1] === dy) return west;
    if (west[0] === dx && west[1] === dy) return north;
    throw new Error(`Invalid direction '${dx}, ${dy}'`);
}

function locateGuard(matrix: string[][]) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const char = getMatrixAt(matrix, x, y);
            const dir = DIRECTIONS[char as keyof typeof DIRECTIONS];
            if (dir) {
                return { x, y, direction: { dx: dir[0], dy: dir[1] } };
            }
        }
    }
    throw new Error("Guard not found");
}

function getMatrixAt(matrix: string[][], x: number, y: number) {
    if (x < 0 || y < 0) {
        return "";
    }
    return matrix[y]?.[x] ?? "";
}

function setMatrixAt(matrix: string[][], x: number, y: number, char: string) {
    if (x < 0 || y < 0) {
        return matrix;
    }
    matrix[y] = matrix[y] ?? [];
    matrix[y][x] = char;
    return matrix;
}
