import { PuzzleSolver } from "../types/puzzle-solver.ts";

type OrderingRule = {
    numbersBefore: Set<number>;
    numbersAfter: Set<number>;
};

export default class Solver24D5 implements PuzzleSolver {
    private rules = new Map<number, OrderingRule>();
    private updates: number[][] = [];

    parseInput(input: string[]) {
        let firstHalf = true;
        input.forEach((line) => {
            if (line === "") {
                firstHalf = false;
                return;
            }
            if (firstHalf) {
                const [left, right] = line.split("|").map(Number);
                const leftRule = this.rules.get(left) ?? {
                    numbersBefore: new Set<number>(),
                    numbersAfter: new Set<number>(),
                };
                const rightRule = this.rules.get(right) ?? {
                    numbersBefore: new Set<number>(),
                    numbersAfter: new Set<number>(),
                };
                leftRule.numbersAfter.add(right);
                rightRule.numbersBefore.add(left);
                this.rules.set(left, leftRule);
                this.rules.set(right, rightRule);
            } else {
                const update = line.split(",").map(Number);
                this.updates.push(update);
            }
        });
    }

    solvePart1() {
        const correctUpdates = this.updates.filter((update) =>
            this.isCorrectOrdering(update)
        );
        let sum = 0;
        correctUpdates.forEach((update) => {
            const middleNumber = update[Math.floor(update.length / 2)];
            sum += middleNumber;
        });
        return sum;
    }

    solvePart2() {
        const incorrectUpdates = this.updates.filter(
            (update) => !this.isCorrectOrdering(update)
        );
        let sum = 0;
        incorrectUpdates.forEach((update) => {
            const fixedUpdate = this.fixOrdering(update);
            const middleNumber =
                fixedUpdate[Math.floor(fixedUpdate.length / 2)];
            sum += middleNumber;
        });
        return sum;
    }

    private fixOrdering(update: number[]): number[] {
        return update.sort((a, b) => {
            const rulesA = this.rules.get(a);
            if (rulesA?.numbersAfter.has(b)) {
                return -1;
            }
            if (rulesA?.numbersBefore.has(b)) {
                return 1;
            }
            return 0;
        });
    }

    private isCorrectOrdering(update: number[]): boolean {
        for (let i = 0; i < update.length; i++) {
            const rule = this.rules.get(update[i]);
            if (!rule) continue;
            const before = update.slice(0, i);
            if (before.some((num) => rule.numbersAfter.has(num))) {
                return false;
            }
            const after = update.slice(i + 1);
            if (after.some((num) => rule.numbersBefore.has(num))) {
                return false;
            }
        }

        return true;
    }
}
