import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver23D3 implements PuzzleSolver {
    private matrix: string[][] = [];

    parseInput(input: string[]) {
        this.matrix = input
            .filter((line) => !!line)
            .map((line) => line.split(""));
    }

    solvePart1() {
        let sum = 0;
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (!isSymbol(this.matrixAt(x, y))) {
                    continue;
                }
                const adjacentPartNumbers = this.getAdjacentPartNumbers(x, y);
                adjacentPartNumbers.forEach(
                    (partNumber) => (sum += partNumber)
                );
            }
        }

        return sum;
    }

    solvePart2() {
        let sum = 0;
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (!isGear(this.matrix[y][x])) {
                    continue;
                }
                const adjacentPartNumbers = this.getAdjacentPartNumbers(x, y);
                if (adjacentPartNumbers.length !== 2) {
                    continue;
                }
                sum += adjacentPartNumbers[0] * adjacentPartNumbers[1];
            }
        }

        return sum;
    }

    private getAdjacentPartNumbers(x: number, y: number) {
        const result = [
            ...this.getNumbersWestAndEastOf(x, y),
            ...this.getNumbersWestAndEastOf(x, y - 1),
            ...this.getNumbersWestAndEastOf(x, y + 1),
        ];
        return result
            .filter((partNumber) => partNumber.length > 0)
            .map((partNumber) => parseInt(partNumber, 10));
    }

    private getNumbersWestAndEastOf(x: number, y: number) {
        const SEPARATOR = "|";
        const west = this.getNumberWestOf(x, y) || SEPARATOR;
        const center = this.getNumberAt(x, y) || SEPARATOR;
        const east = this.getNumberEastOf(x, y) || SEPARATOR;
        return (west + center + east).split(SEPARATOR);
    }

    private getNumberWestOf(x: number, y: number) {
        let result = "";
        while (isDigit(this.matrixAt(x - 1, y))) {
            result = this.matrixAt(x - 1, y) + result;
            x--;
        }
        return result;
    }

    private getNumberEastOf(x: number, y: number) {
        let result = "";
        while (isDigit(this.matrixAt(x + 1, y))) {
            result += this.matrixAt(x + 1, y);
            x++;
        }
        return result;
    }

    private getNumberAt(x: number, y: number) {
        const char = this.matrixAt(x, y);
        return isDigit(char) ? char : "";
    }

    private matrixAt(x: number, y: number) {
        if (x < 0 || y < 0) {
            return "";
        }
        return this.matrix[y]?.[x] ?? "";
    }
}

function isDigit(char: string): boolean {
    return (
        typeof char === "string" &&
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)
    );
}

function isSymbol(char: string): boolean {
    return typeof char === "string" && char !== "." && !isDigit(char);
}

function isGear(char: string): boolean {
    return char === "*";
}
