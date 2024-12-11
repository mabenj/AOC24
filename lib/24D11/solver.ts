import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D11 implements PuzzleSolver {
    private initialStones: number[] = [];

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
        this.initialStones.forEach((stone) =>
            alterMapValue(frequencyMap, stone, 1)
        );
        for (let i = 0; i < n; i++) {
            for (const [stone, count] of [...frequencyMap]) {
                alterMapValue(frequencyMap, stone, -count);
                const resultStones = handleStone(stone);
                resultStones.forEach((stone) =>
                    alterMapValue(frequencyMap, stone, count)
                );
            }
        }
        return frequencyMap.values().reduce((acc, count) => acc + count, 0);
    }
}

function handleStone(stoneNumber: number) {
    if (stoneNumber === 0) {
        return [1];
    }
    const str = stoneNumber.toString();
    if (str.length % 2 === 0) {
        const left = Number(str.slice(0, str.length / 2));
        const right = Number(str.slice(str.length / 2));
        return [left, right];
    }
    return [stoneNumber * 2024];
}

function alterMapValue(
    map: Map<number, number>,
    key: number,
    valueToAdd: number
) {
    const newValue = (map.get(key) ?? 0) + valueToAdd;
    if (newValue === 0) {
        map.delete(key);
    } else {
        map.set(key, newValue);
    }
}
