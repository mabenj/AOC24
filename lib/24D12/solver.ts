import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;

const DIRECTIONS = [
    [0, -1], // north
    [0, 1], // south
    [1, 0], // east
    [-1, 0], // west
];

type Region = {
    type: string;
    perimeterSize: number;
    plotCoords: { x: number; y: number }[];
};

export default class Solver24D12 implements PuzzleSolver {
    private grid: string[][] = [];

    parseInput(input: string[]) {
        input = EXAMPLE.split("\n");
        this.grid = input
            .filter((line) => !!line)
            .map((line) => line.split(""));
    }

    solvePart1() {
        return calculateFencePrice(this.discoverAllRegions(), false);
    }

    solvePart2() {
        return calculateFencePrice(this.discoverAllRegions(), true);
    }

    private discoverAllRegions(): Region[] {
        const foundRegions: Region[] = [];
        const visited = new Set<string>();
        const unvisited = this.grid
            .map((line, y) => line.map((_, x) => ({ x, y })))
            .flat();
        while (unvisited.length > 0) {
            const { x, y } = unvisited.shift()!;
            if (visited.has(`${x},${y}`)) {
                continue;
            }
            const region = this.discoverRegion(x, y);
            region.plotCoords.forEach((coords) => {
                visited.add(`${coords.x},${coords.y}`);
            });
            foundRegions.push(region);
        }
        return foundRegions;
    }

    private discoverRegion(x: number, y: number): Region {
        const type = this.gridAt(x, y);
        let perimeterSize = 0;
        const found: Region["plotCoords"] = [];
        const visited = new Set<string>();

        // flood fill
        const queue = [{ x, y }];
        while (queue.length > 0) {
            const { x, y } = queue.shift()!;
            if (visited.has(`${x},${y}`)) {
                continue;
            }
            visited.add(`${x},${y}`);

            found.push({ x, y });
            for (const [dx, dy] of DIRECTIONS) {
                const neighborType = this.gridAt(x + dx, y + dy);
                if (neighborType === type) {
                    queue.push({ x: x + dx, y: y + dy });
                } else {
                    perimeterSize++;
                    visited.add(`${x + dx},${y + dy}`);
                }
            }
        }

        return { type, perimeterSize, plotCoords: found };
    }

    private gridAt(x: number, y: number) {
        if (x < 0 || y < 0) {
            return "";
        }
        return this.grid[y]?.[x] ?? "";
    }
}

function calculateFencePrice(regions: Region[], useBulkDiscount: boolean) {
    let sum = 0;
    for (const region of regions) {
        const area = region.plotCoords.length;
        if (useBulkDiscount) {
            const numberOfSides = calculateNumberOfSides(region);
            sum += area * numberOfSides;
        } else {
            sum += area * region.perimeterSize;
        }
    }
    return sum;
}

function calculateNumberOfSides(region: Region): number {
    throw new Error("Not implemented");
}
