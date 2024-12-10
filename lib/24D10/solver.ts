import { LINE_SEPARATOR } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS = {
    north: [0, -1],
    east: [1, 0],
    south: [0, 1],
    west: [-1, 0],
};

const TOPO_PROFILE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const EXAMPLE = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

type Coordinate = { x: number; y: number };
type Trail = Coordinate[];

export default class Solver24D10 implements PuzzleSolver {
    private grid: number[][] = [];

    parseInput(input: string[]) {
        input = EXAMPLE.split(LINE_SEPARATOR);
        this.grid = input
            .filter((line) => !!line)
            .map((line) => line.split("").map(Number));
    }

    solvePart1() {
        const trailHeads = getAllTrails(this.grid);
        return sumTrailScores(trailHeads);
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

function getAllTrails(grid: number[][]): Trail[] {
    const result: Trail[] = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const trails = getTrailsStartingFrom(grid, x, y);
            result.push(...trails);
        }
    }
    return result;
}

function getTrailsStartingFrom(
    grid: number[][],
    x: number,
    y: number
): Trail[] {
    if (gridAt(grid, x, y) !== TOPO_PROFILE[0]) {
        return [];
    }
    const result: Trail[] = [];
    let currentTrail: Trail = [{ x, y }];
    let allTrailsFound = false;
    while (!allTrailsFound) {
        const expectedTopo = TOPO_PROFILE[currentTrail.length];
        for (const [dx, dy] of Object.values(DIRECTIONS)) {
            const topoCandidate = gridAt(grid, x + dx, y + dy);
            if (topoCandidate !== expectedTopo) {
                continue;
            }
            x += dx;
            y += dy;
            currentTrail.push({ x, y });
        }
    }
    return result;
}

function gridAt(grid: number[][], x: number, y: number): number | null {
    if (x < 0 || y < 0) {
        return null;
    }
    return grid[y]?.[x] ?? null;
}

function sumTrailScores(trails: Trail[]): number {
    return 0;
}
