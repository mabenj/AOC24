import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D25 implements PuzzleSolver {
    private locks: number[][] = [];
    private keys: number[][] = [];

    parseInput(input: string[]) {
        for (let i = 0; i < input.length; i += 8) {
            const heights = Array.from<number>({ length: 5 }).fill(0);
            for (let j = i + 1; j < i + 6; j++) {
                for (let k = 0; k < heights.length; k++) {
                    if (input[j][k] === "#") {
                        heights[k]++;
                    }
                }
            }
            const isLock = input[i].startsWith("#");
            if (isLock) {
                this.locks.push(heights);
            } else {
                this.keys.push(heights);
            }
        }
    }

    solvePart1() {
        let count = 0;
        for (const lock of this.locks) {
            for (const key of this.keys) {
                let keyFits = true;
                let i = 0;
                while (i < 5 && keyFits) {
                    keyFits = lock[i] + key[i] <= 5;
                    i++;
                }
                if (keyFits) count++;
            }
        }

        return count;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}
