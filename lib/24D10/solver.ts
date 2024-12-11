import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS = {
    north: [0, -1],
    east: [1, 0],
    south: [0, 1],
    west: [-1, 0],
};

type Trail = { x: number; y: number }[];

export default class Solver24D10 implements PuzzleSolver {
    private grid: number[][] = [];

    parseInput(input: string[]) {
        this.grid = input
            .filter((line) => !!line)
            .map((line) => line.split("").map(Number));
    }

    solvePart1() {
        const trails = this.getAllTrails();
        return sumTrailScores(trails);
    }

    solvePart2() {
        const trails = this.getAllTrails();
        return sumTrailRatings(trails);
    }

    private getAllTrails(): Trail[] {
        const result: Trail[] = [];
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const trails = this.getTrailsStartingFrom(
                    x,
                    y,
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                );
                result.push(...trails);
            }
        }
        return result;
    }

    private getTrailsStartingFrom(
        x: number,
        y: number,
        profile: number[]
    ): Trail[] {
        const current = this.gridAt(x, y);
        if (current == null || current !== profile[0]) {
            return [];
        }
        if (profile.length === 1) {
            return [[{ x, y }]];
        }
        const result: Trail[] = [];
        for (const [dx, dy] of Object.values(DIRECTIONS)) {
            const trails = this.getTrailsStartingFrom(
                x + dx,
                y + dy,
                profile.slice(1)
            );
            for (let trail of trails) {
                trail = [{ x, y }, ...trail];
                if (trail.length !== profile.length) {
                    continue;
                }
                result.push(trail);
            }
        }
        return result;
    }

    private gridAt(x: number, y: number): number | null {
        if (x < 0 || y < 0) {
            return null;
        }
        return this.grid[y]?.[x] ?? null;
    }
}

function sumTrailScores(trails: Trail[]): number {
    const distinctStartEndPoints = new Set(
        trails.map((trail) => {
            const start = trail[0];
            const end = trail[trail.length - 1];
            return `${start.x},${start.y} -> ${end.x},${end.y}`;
        })
    );
    return distinctStartEndPoints.size;
}

function sumTrailRatings(trails: Trail[]): number {
    return trails.length;
}
