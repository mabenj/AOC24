import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;
// const EXAMPLE = `##########
// #..O..O.O#
// #......O.#
// #.OO..O.O#
// #..O@..O.#
// #O#..O...#
// #O..O..O.#
// #.OO.O.OO#
// #....O...#
// ##########

// <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
// vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
// ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
// <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
// ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
// ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
// >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
// <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
// ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
// v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const DIRECTIONS: Record<string, [number, number]> = {
    "^": [0, -1],
    ">": [1, 0],
    v: [0, 1],
    "<": [-1, 0],
};

type GridItem = "#" | "O" | "." | "@";

export default class Solver24D15 implements PuzzleSolver {
    private grid: GridItem[][] = [];
    private moves: string[] = [];
    private robotStart = { x: -1, y: -1 };

    parseInput(input: string[]) {
        input = EXAMPLE.split("\n");
        for (const line of input) {
            if (!line) continue;

            const items = line.split("");
            if (items.some((item) => item === "@")) {
                this.robotStart = {
                    x: items.indexOf("@"),
                    y: input.indexOf(line),
                };
            }
            if (items[0] === "#") {
                this.grid.push(items.map((item) => item as GridItem));
            } else {
                this.moves.push(...items);
            }
        }
    }

    solvePart1() {
        this.grid = executeMoves(this.grid, this.moves, this.robotStart);
        return calculateGpsSum(this.grid);
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

function executeMoves(
    grid: GridItem[][],
    moves: string[],
    robot: { x: number; y: number }
) {
    const moveItemAt = (
        x: number,
        y: number,
        dx: number,
        dy: number
    ): boolean => {
        const current = grid[y][x];
        const target = grid[y + dy][x + dx];
        if (target === "#") return false;
        if (target === "." || moveItemAt(x + dx, y + dy, dx, dy)) {
            grid[y + dy][x + dx] = current;
            grid[y][x] = ".";
            return true;
        }
        return false;
    };

    for (const move of moves) {
        const [dx, dy] = DIRECTIONS[move];
        const success = moveItemAt(robot.x, robot.y, dx, dy);
        if (success) {
            robot = { x: robot.x + dx, y: robot.y + dy };
        }
        // console.log(`--- Move ${move} ----`);
        // for (const line of grid) {
        //     console.log(line.join(""));
        // }
    }

    return grid;
}

function calculateGpsSum(grid: GridItem[][]) {
    let sum = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== "O") {
                continue;
            }
            sum += 100 * y + x;
        }
    }
    return sum;
}
