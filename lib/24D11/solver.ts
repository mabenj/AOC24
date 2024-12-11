import { memoize } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D11 implements PuzzleSolver {
    private initialStones: number[] = [];
    private handleStone = memoize((stoneNumber: number) => {
        if (stoneNumber === 0) {
            return [1];
        }
        if (hasEvenDigits(stoneNumber)) {
            const str = stoneNumber.toString();
            const left = Number(str.slice(0, str.length / 2));
            const right = Number(str.slice(str.length / 2));
            return [left, right];
        }
        return [stoneNumber * 2024];
    });

    parseInput(input: string[]) {
        this.initialStones = input[0].split(" ").map(Number);
    }

    solvePart1() {
        return this.blink(25);
    }

    solvePart2() {
        return this.blink(75);
    }

    private blink(n: number) {
        let sum = 0;
        for (const stone of this.initialStones) {
            const frequencyMap = new Map<number, number>([[stone, 1]]);
            for (let i = 0; i < n; i++) {
                for (const [stone, count] of [...frequencyMap]) {
                    alterMapValue(frequencyMap, stone, -count);
                    const resultStones = this.handleStone(stone);
                    resultStones.forEach((stone) =>
                        alterMapValue(frequencyMap, stone, count)
                    );
                }
            }
            sum += frequencyMap.values().reduce((acc, count) => acc + count, 0);
        }
        return sum;
    }
}

function hasEvenDigits(num: number) {
    return num.toString().length % 2 === 0;
}

function alterMapValue(
    map: Map<number, number>,
    key: number,
    valueToAdd: number
) {
    if (valueToAdd === 0) {
        return;
    }
    map.set(key, (map.get(key) ?? 0) + valueToAdd);
}
