import { PuzzleSolver } from "../types/puzzle-solver.ts";

type Coordinate = { x: number; y: number };

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
                let partNumberCandidate = this.matrix[y][x];
                if (!isDigit(partNumberCandidate)) {
                    continue;
                }
                const occupiedCoordinates = [{ x, y }];
                while (isDigit(this.matrix[y][x + 1])) {
                    partNumberCandidate += this.matrix[y][x + 1];
                    occupiedCoordinates.push({ x: x + 1, y });
                    x++;
                }
                if (isAdjacentToSymbol(this.matrix, occupiedCoordinates)) {
                    sum += parseInt(partNumberCandidate, 10);
                }
            }
        }

        return sum;
    }

    solvePart2() {
        return -1;
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

function isAdjacentToSymbol(
    matrix: string[][],
    coordinates: Coordinate[]
): boolean {
    return coordinates.some(
        ({ x, y }) =>
            isSymbol(matrix[y]?.[x + 1]) || // E
            isSymbol(matrix[y + 1]?.[x + 1]) || // SE
            isSymbol(matrix[y + 1]?.[x]) || // S
            isSymbol(matrix[y + 1]?.[x - 1]) || // SW
            isSymbol(matrix[y]?.[x - 1]) || // W
            isSymbol(matrix[y - 1]?.[x - 1]) || // NW
            isSymbol(matrix[y - 1]?.[x]) || // N
            isSymbol(matrix[y - 1]?.[x + 1]) // NE
    );
}
