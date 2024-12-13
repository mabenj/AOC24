import { objectKeys } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS = {
    N: { dx: 0, dy: -1, isDiagonal: false },
    NE: { dx: 1, dy: -1, isDiagonal: true },
    E: { dx: 1, dy: 0, isDiagonal: false },
    SE: { dx: 1, dy: 1, isDiagonal: true },
    S: { dx: 0, dy: 1, isDiagonal: false },
    SW: { dx: -1, dy: 1, isDiagonal: true },
    W: { dx: -1, dy: 0, isDiagonal: false },
    NW: { dx: -1, dy: -1, isDiagonal: true },
};

type Region = {
    type: string;
    perimeterSize: number;
    cornerCount: number;
    plotCoords: { x: number; y: number }[];
};

export default class Solver24D12 implements PuzzleSolver {
    private grid: string[][] = [];

    parseInput(input: string[]) {
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
        const unprocessed = this.grid
            .map((line, y) => line.map((_, x) => ({ x, y })))
            .flat();
        while (unprocessed.length > 0) {
            const { x, y } = unprocessed.shift()!;
            if (visited.has(`${x},${y}`)) {
                continue;
            }
            const region = this.discoverRegion(x, y);
            region.plotCoords.forEach(({ x, y }) => visited.add(`${x},${y}`));
            foundRegions.push(region);
        }
        return foundRegions;
    }

    private discoverRegion(startX: number, startY: number): Region {
        const type = this.gridAt(startX, startY);
        let perimeterSize = 0;
        let cornerCount = 0;
        const plotCoords: Region["plotCoords"] = [];
        const visited = new Set<string>();

        // flood fill
        const queue = [{ x: startX, y: startY }];
        while (queue.length > 0) {
            const { x, y } = queue.shift()!;
            if (visited.has(`${x},${y}`)) {
                continue;
            }
            visited.add(`${x},${y}`);

            plotCoords.push({ x, y });
            for (const direction of objectKeys(DIRECTIONS)) {
                const { dx, dy, isDiagonal } = DIRECTIONS[direction];
                if (isDiagonal) {
                    // check if it's a corner
                    const hasOutwardCorner =
                        this.gridAt(x + dx, y + dy) !== type &&
                        this.gridAt(x + dx, y) === type &&
                        this.gridAt(x, y + dy) === type;
                    const hasInwardCorner =
                        this.gridAt(x, y + dy) !== type &&
                        this.gridAt(x + dx, y) !== type;
                    if (hasOutwardCorner || hasInwardCorner) {
                        cornerCount++;
                    }
                } else if (this.gridAt(x + dx, y + dy) === type) {
                    // continue flood fill
                    queue.push({ x: x + dx, y: y + dy });
                } else {
                    // found a perimeter
                    perimeterSize++;
                    visited.add(`${x + dx},${y + dy}`);
                }
            }
        }

        return { type, perimeterSize, cornerCount, plotCoords };
    }

    private gridAt(x: number, y: number) {
        if (x < 0 || y < 0) {
            return "";
        }
        return this.grid[y]?.[x] ?? "";
    }
}

function calculateFencePrice(regions: Region[], useBulkDiscount: boolean) {
    return regions.reduce((acc, region) => {
        const area = region.plotCoords.length;
        const multiplier = useBulkDiscount
            ? region.cornerCount
            : region.perimeterSize;
        return acc + area * multiplier;
    }, 0);
}
