import { objectKeys, reverseString } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D4 implements PuzzleSolver {
    private matrix: string[][] = [];

    parseInput(input: string[]) {
        this.matrix = input.map((line) => line.split(""));
    }

    solvePart1() {
        const WORD = "XMAS";
        let sum = 0;
        this.traverseMatrix((x, y) => {
            sum += this.getNumberOfWordsAt(x, y, WORD);
        });
        return sum;
    }

    solvePart2() {
        const WORD = "MAS";
        let sum = 0;
        this.traverseMatrix((x, y) => {
            const isCrossed = this.isWordCrossedAt(x, y, WORD);
            if (isCrossed) sum++;
        });
        return sum;
    }

    private isWordCrossedAt(x: number, y: number, word: string): boolean {
        if (word.length % 2 === 0) {
            return false;
        }
        const middleIndex = Math.floor(word.length / 2);
        const middleChar = word[middleIndex];
        if (this.matrixAt(x, y) !== middleChar) {
            return false;
        }

        const DIRECTIONS = {
            northeast: [1, -1],
            southeast: [1, 1],
            southwest: [-1, 1],
            northwest: [-1, -1],
        };

        const getStringInDirection = (
            direction: keyof typeof DIRECTIONS,
            length: number
        ) => {
            const [dx, dy] = DIRECTIONS[direction];
            let str = "";
            for (let i = 1; i <= length; i++) {
                str += this.matrixAt(x + dx * i, y + dy * i);
            }
            return str;
        };

        const nwToSe =
            getStringInDirection("northwest", middleIndex) +
            middleChar +
            getStringInDirection("southeast", middleIndex);
        if (nwToSe !== word && reverseString(nwToSe) !== word) {
            return false;
        }

        const neToSw =
            getStringInDirection("northeast", middleIndex) +
            middleChar +
            getStringInDirection("southwest", middleIndex);
        if (neToSw !== word && reverseString(neToSw) !== word) {
            return false;
        }

        return true;
    }

    private getNumberOfWordsAt(x: number, y: number, word: string): number {
        if (this.matrixAt(x, y) !== word[0]) {
            return 0;
        }

        const DIRECTIONS = {
            north: [0, -1],
            northeast: [1, -1],
            east: [1, 0],
            southeast: [1, 1],
            south: [0, 1],
            southwest: [-1, 1],
            west: [-1, 0],
            northwest: [-1, -1],
        };

        let sum = 0;
        for (const direction of objectKeys(DIRECTIONS)) {
            const [dx, dy] = DIRECTIONS[direction];
            let found = true;
            for (let i = 1; i < word.length; i++) {
                const expectedChar = word[i];
                const actualChar = this.matrixAt(x + dx * i, y + dy * i);
                if (expectedChar !== actualChar) {
                    found = false;
                    break;
                }
            }
            if (found) sum++;
        }
        return sum;
    }

    private traverseMatrix(callback: (x: number, y: number) => void) {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                callback(x, y);
            }
        }
    }

    private matrixAt(x: number, y: number): string {
        if (x < 0 || y < 0) {
            return "";
        }
        return this.matrix[y]?.[x] ?? "";
    }
}
