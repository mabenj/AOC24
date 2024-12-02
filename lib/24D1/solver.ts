import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D1 implements PuzzleSolver {
    private list1: number[] = [];
    private list2: number[] = [];

    parseInput(input: string[]) {
        const [list1, list2] = input.reduce(
            (acc, line) => {
                const [num1, num2] = line.split("   ");
                if (num1 && num2) {
                    acc[0].push(parseInt(num1.trim()));
                    acc[1].push(parseInt(num2.trim()));
                }
                return acc;
            },
            [[], []] as [number[], number[]]
        );
        this.list1 = list1;
        this.list2 = list2;
    }

    solvePart1() {
        this.list1.sort((a, b) => a - b);
        this.list2.sort((a, b) => a - b);

        let sum = 0;
        for (let i = 0; i < this.list1.length; i++) {
            sum += Math.abs(this.list1[i] - this.list2[i]);
        }

        return sum;
    }

    solvePart2() {
        const occurrenceMap = this.list2.reduce((acc, num) => {
            acc.set(num, (acc.get(num) ?? 0) + 1);
            return acc;
        }, new Map<number, number>());

        const similarityScore = this.list1.reduce((acc, num) => {
            const multiplier = occurrenceMap.get(num) ?? 0;
            return acc + num * multiplier;
        }, 0);

        return similarityScore;
    }
}
