import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver23D1 implements PuzzleSolver {
    private inputLines: string[] = [];

    parseInput(input: string[]) {
        this.inputLines = input.filter((line) => !!line);
    }

    solvePart1() {
        const sum = this.inputLines.reduce((acc, line) => {
            const digits = line
                .split("")
                .filter((char) =>
                    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
                        char
                    )
                );
            if (digits.length === 0) {
                return acc;
            }
            const digit1 = digits[0];
            const digit2 = digits.reverse()[0];
            const calibrationNumber = parseInt(digit1 + digit2, 10);
            return acc + calibrationNumber;
        }, 0);

        return sum;
    }

    solvePart2() {
        const sum = this.inputLines.reduce(
            (acc, line) => acc + getCalibrationNumber(line),
            0
        );
        return sum;
    }
}

function getCalibrationNumber(inputLine: string): number {
    const first = getFirstDigit(inputLine);
    const last = getLastDigit(inputLine);
    const number = parseInt(first + last, 10);
    return isNaN(number) ? 0 : number;
}

function getFirstDigit(inputLine: string): string {
    for (let i = 0; i < inputLine.length; i++) {
        for (let j = i + 1; j <= inputLine.length; j++) {
            const substring = inputLine.substring(i, j);
            if (DIGIT_LOOKUP[substring]) {
                return DIGIT_LOOKUP[substring];
            }
        }
    }
    return "";
}

function getLastDigit(inputLine: string): string {
    for (let i = inputLine.length; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            const substring = inputLine.substring(j, i);
            if (DIGIT_LOOKUP[substring]) {
                return DIGIT_LOOKUP[substring];
            }
        }
    }
    return "";
}

const DIGIT_LOOKUP: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
};
