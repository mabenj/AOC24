import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `125 17`;

type Stone = {
    value: number;
    next: Stone | null;
};

export default class Solver24D11 implements PuzzleSolver {
    private firstStone: Stone | null = null;
    private memoizedStoneNumbers = new Map<number, number | [number, number]>();

    parseInput(input: string[]) {
        // input = [EXAMPLE];
        input[0]
            .split(" ")
            .map(Number)
            .forEach((num) => {
                const stone: Stone = {
                    value: num,
                    next: null,
                };
                if (this.firstStone === null) {
                    this.firstStone = stone;
                } else {
                    let prevStone = this.firstStone;
                    while (prevStone.next !== null) {
                        prevStone = prevStone.next;
                    }
                    prevStone.next = stone;
                }
            });
    }

    solvePart1() {
        this.blink(25);
        return this.countStones();
    }

    solvePart2() {
        this.blink(75);
        return this.countStones();
    }

    private blink(n: number) {
        for (let blink = 0; blink < n; blink++) {
            let currentStone = this.firstStone;
            while (currentStone !== null) {
                currentStone = this.handleStone(currentStone);
            }

            // console.log(
            //     `After ${blink + 1} blinks:`,
            //     getNumberArray(this.firstStone)
            // );
            console.log(`Blink ${blink + 1}`);
        }
    }

    private handleStone(stone: Stone): Stone | null {
        let newStoneNumbers: number | [number, number];
        if (this.memoizedStoneNumbers.has(stone.value)) {
            newStoneNumbers = this.memoizedStoneNumbers.get(stone.value)!;
        } else {
            if (stone.value === 0) {
                newStoneNumbers = 1;
            } else if (hasEvenDigits(stone.value)) {
                const str = stone.value.toString();
                const left = Number(str.slice(0, str.length / 2));
                const right = Number(str.slice(str.length / 2));
                newStoneNumbers = [left, right];
            } else {
                newStoneNumbers = stone.value * 2024;
            }
            this.memoizedStoneNumbers.set(stone.value, newStoneNumbers);
        }

        if (typeof newStoneNumbers === "number") {
            stone.value = newStoneNumbers;
            return stone.next;
        }

        const newStone = {
            value: newStoneNumbers[1],
            next: stone.next,
        };
        stone.value = newStoneNumbers[0];
        stone.next = newStone;
        return newStone.next;
    }

    private countStones() {
        let count = 0;
        let currentStone = this.firstStone;
        while (currentStone !== null) {
            count++;
            currentStone = currentStone.next;
        }
        return count;
    }
}

function hasEvenDigits(num: number) {
    return num.toString().length % 2 === 0;
}

function getNumberArray(stone: Stone | null) {
    const numbers: number[] = [];
    while (stone !== null) {
        numbers.push(stone.value);
        stone = stone.next;
    }
    return numbers;
}
