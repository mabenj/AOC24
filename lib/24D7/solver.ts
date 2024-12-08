import { PuzzleSolver } from "../types/puzzle-solver.ts";

type Equation = {
    testValue: number;
    numbers: number[];
};

export default class Solver24D7 implements PuzzleSolver {
    private equations: Equation[] = [];

    parseInput(input: string[]) {
        this.equations = input
            .filter((line) => !!line)
            .map((line) => line.split(": "))
            .map(([testValue, numbers]) => ({
                testValue: parseInt(testValue, 10),
                numbers: numbers.split(" ").map((n) => parseInt(n, 10)),
            }));
    }

    solvePart1() {
        return this.equations
            .filter((eq) => isSolvable(eq, ["+", "*"]))
            .reduce((acc, equation) => acc + equation.testValue, 0);
    }

    solvePart2() {
        return this.equations
            .filter((eq) => isSolvable(eq, ["+", "*", "||"]))
            .reduce((acc, equation) => acc + equation.testValue, 0);
    }
}

function isSolvable(equation: Equation, operators: string[]) {
    const operatorCount = equation.numbers.length - 1;
    for (const operatorPermutation of generatePermutations(
        operators,
        operatorCount
    )) {
        let result = equation.numbers[0];
        for (let i = 1; i < equation.numbers.length; i++) {
            const operator = operatorPermutation[i - 1];
            const number = equation.numbers[i];
            switch (operator) {
                case "+":
                    result += number;
                    break;
                case "*":
                    result *= number;
                    break;
                case "||":
                    result = parseInt(`${result}${number}`, 10);
                    break;
                default:
                    throw new Error(`Unknown operator: ${operator}`);
            }
        }
        if (result === equation.testValue) {
            return true;
        }
    }
    return false;
}

function* generatePermutations(
    chars: string[],
    n: number
): Generator<string[]> {
    if (n === 0) {
        yield [];
        return;
    }

    for (const char of chars) {
        for (const permutation of generatePermutations(chars, n - 1)) {
            yield [char, ...permutation];
        }
    }
}
