import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D11 implements PuzzleSolver {
    private initialStones: number[] = [];
    private memoizedStoneNumbers = new Map<number, number | [number, number]>();

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
        const frequencyMap = new Map<number, number>();
        this.initialStones.forEach((stoneNumber) =>
            frequencyMap.set(
                stoneNumber,
                (frequencyMap.get(stoneNumber) ?? 0) + 1
            )
        );
        for (let blink = 0; blink < n; blink++) {
            const intermediateMap = new Map<number, number>();

            for (const [stoneNumber, count] of frequencyMap) {
                intermediateMap.set(
                    stoneNumber,
                    (intermediateMap.get(stoneNumber) ?? 0) - count
                );
                const newStoneNumbers = this.handleStoneNumber(stoneNumber);
                if (typeof newStoneNumbers === "number") {
                    intermediateMap.set(
                        newStoneNumbers,
                        (intermediateMap.get(newStoneNumbers) ?? 0) + count
                    );
                } else {
                    const [left, right] = newStoneNumbers;
                    intermediateMap.set(
                        left,
                        (intermediateMap.get(left) ?? 0) + count
                    );
                    intermediateMap.set(
                        right,
                        (intermediateMap.get(right) ?? 0) + count
                    );
                }
            }

            for (const [stoneNumber, count] of intermediateMap) {
                const newValue = (frequencyMap.get(stoneNumber) ?? 0) + count;
                if (newValue === 0) {
                    frequencyMap.delete(stoneNumber);
                } else {
                    frequencyMap.set(stoneNumber, newValue);
                }
            }
        }

        return Array.from(frequencyMap.values()).reduce(
            (acc, curr) => acc + curr,
            0
        );
    }

    private handleStoneNumber(stoneNumber: number): number | [number, number] {
        if (this.memoizedStoneNumbers.has(stoneNumber)) {
            return this.memoizedStoneNumbers.get(stoneNumber)!;
        }

        let newStoneNumbers: number | [number, number];
        if (stoneNumber === 0) {
            newStoneNumbers = 1;
        } else if (hasEvenDigits(stoneNumber)) {
            const str = stoneNumber.toString();
            const left = Number(str.slice(0, str.length / 2));
            const right = Number(str.slice(str.length / 2));
            newStoneNumbers = [left, right];
        } else {
            newStoneNumbers = stoneNumber * 2024;
        }
        this.memoizedStoneNumbers.set(stoneNumber, newStoneNumbers);
        return newStoneNumbers;
    }
}

function hasEvenDigits(num: number) {
    return num.toString().length % 2 === 0;
}
