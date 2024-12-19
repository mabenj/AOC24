import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D19 implements PuzzleSolver {
    private patterns = new Set<string>();
    private designs = new Array<string>();

    parseInput(input: string[]) {
        this.patterns = new Set(input[0].split(", "));
        this.designs = input.slice(2).filter((line) => !!line);
    }

    solvePart1() {
        const cache = new Map<string, boolean>();

        const isPossible = (design: string) => {
            if (cache.has(design)) {
                return cache.get(design);
            }
            let endIdx = 1;
            while (endIdx <= design.length) {
                const subDesign = design.slice(0, endIdx);
                if (
                    this.patterns.has(subDesign) &&
                    (endIdx === design.length ||
                        isPossible(design.slice(endIdx)))
                ) {
                    cache.set(design, true);
                    return true;
                } else {
                    endIdx++;
                }
            }
            cache.set(design, false);
            return false;
        };

        return this.designs.filter(isPossible).length;
    }

    solvePart2() {
        const cache = new Map<string, number>();

        const countPossible = (design: string) => {
            if (cache.has(design)) {
                return cache.get(design)!;
            }
            let sum = 0;
            let endIdx = 1;
            while (endIdx <= design.length) {
                const subDesign = design.slice(0, endIdx);
                if (this.patterns.has(subDesign)) {
                    const rest = design.slice(endIdx);
                    if (rest.length === 0) {
                        sum++;
                    } else {
                        sum += countPossible(rest);
                    }
                }
                endIdx++;
            }
            cache.set(design, sum);
            return sum;
        };

        return this.designs.reduce(
            (acc, design) => acc + countPossible(design),
            0
        );
    }
}
