import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS: Record<string, [number, number]> = {
    "^": [0, -1],
    ">": [1, 0],
    v: [0, 1],
    "<": [-1, 0],
};

type GridItem = "#" | "O" | "." | "@" | "[" | "]";

export default class Solver24D15 implements PuzzleSolver {
    private grid: GridItem[][] = [];
    private moves: string[] = [];

    parseInput(input: string[]) {
        for (const line of input) {
            if (!line) continue;
            const items = line.split("");
            if (items[0] === "#") {
                this.grid.push(items.map((item) => item as GridItem));
            } else {
                this.moves.push(...items);
            }
        }
    }

    solvePart1() {
        const moveItem = (x: number, y: number, dx: number, dy: number) => {
            const current = this.grid[y][x];
            const target = this.grid[y + dy][x + dx];
            if (target === "#") {
                return false;
            }
            if (target === "." || moveItem(x + dx, y + dy, dx, dy)) {
                this.grid[y + dy][x + dx] = current;
                this.grid[y][x] = ".";
                return true;
            }
            return false;
        };

        let robot = findRobot(this.grid);
        for (const move of this.moves) {
            const [dx, dy] = DIRECTIONS[move];
            const success = moveItem(robot.x, robot.y, dx, dy);
            if (success) {
                robot = { x: robot.x + dx, y: robot.y + dy };
            }
        }
        return calculateGpsSum(this.grid);
    }

    solvePart2() {
        const expandedGrid: GridItem[][] = this.grid.map((row) =>
            row.flatMap((item) => {
                if (item === "#") return ["#", "#"];
                if (item === "O") return ["[", "]"];
                if (item === ".") return [".", "."];
                return ["@", "."];
            })
        );

        const moveItemHorizontal = (x: number, y: number, dx: number) => {
            const current = expandedGrid[y][x];
            const target = expandedGrid[y][x + dx];
            if (target === "#") {
                return false;
            }
            if (target === "." || moveItemHorizontal(x + dx, y, dx)) {
                expandedGrid[y][x + dx] = current;
                expandedGrid[y][x] = ".";
                return true;
            }
            return false;
        };

        const moveItemsVertical = (
            coords: { x: number; y: number }[],
            dy: number
        ) => {
            if (coords.some(({ x, y }) => expandedGrid[y + dy][x] === "#")) {
                return false;
            }
            const nextCoords = coords
                .flatMap(({ x, y }) => {
                    const item = expandedGrid[y + dy][x];
                    if (item === "]") {
                        const leftCoords = { x: x - 1, y: y + dy };
                        return [leftCoords, { x, y: y + dy }];
                    }
                    if (item === "[") {
                        const rightCoords = { x: x + 1, y: y + dy };
                        return [{ x, y: y + dy }, rightCoords];
                    }
                    return [];
                })
                .filter(
                    (coords, i, arr) =>
                        arr.findIndex(
                            (coords2) =>
                                coords2.x === coords.x && coords2.y === coords.y
                        ) === i
                );
            if (
                coords.every(({ x, y }) => expandedGrid[y + dy][x] === ".") ||
                moveItemsVertical(nextCoords, dy)
            ) {
                coords.forEach(({ x, y }) => {
                    expandedGrid[y + dy][x] = expandedGrid[y][x];
                    expandedGrid[y][x] = ".";
                });
                return true;
            }
            return false;
        };

        let robot = findRobot(expandedGrid);
        for (const move of this.moves) {
            const [dx, dy] = DIRECTIONS[move];
            const isVertical = dx === 0 && dy !== 0;
            const success = isVertical
                ? moveItemsVertical([{ x: robot.x, y: robot.y }], dy)
                : moveItemHorizontal(robot.x, robot.y, dx);
            if (success) {
                robot = { x: robot.x + dx, y: robot.y + dy };
            }
        }

        return calculateGpsSum(expandedGrid);
    }
}

function calculateGpsSum(grid: GridItem[][]) {
    let sum = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O" || grid[y][x] === "[") {
                sum += 100 * y + x;
            }
        }
    }
    return sum;
}

function findRobot(grid: GridItem[][]) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "@") {
                return { x, y };
            }
        }
    }
    throw new Error("Robot not found");
}
