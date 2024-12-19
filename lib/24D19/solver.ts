import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

export default class Solver24D19 implements PuzzleSolver {
    private patterns = new Set<string>();
    private designs = new Array<string>();

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
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

        return this.designs.reduce(
            (acc, design) => acc + (isPossible(design) ? 1 : 0),
            0
        );
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}
