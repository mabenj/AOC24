import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `1
10
100
2024
`;

export default class Solver24D22 implements PuzzleSolver {
    private secretNumbers: number[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        this.secretNumbers = input.filter((line) => !!line).map(Number);
    }

    solvePart1() {
        let sum = 0;
        for (const initialSecret of this.secretNumbers) {
            sum += SecretNumberGenerator.getNextSecretNumber(
                initialSecret,
                2000
            );
        }

        return sum;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

class SecretNumberGenerator {
    private static knownSecretNumbers = new Map<bigint, bigint>();

    static getNextSecretNumber(secretNumber: number, n: number) {
        let prevSecret = BigInt(secretNumber);
        for (let i = 0; i < n; i++) {
            let nextSecret: bigint;
            if (this.knownSecretNumbers.has(prevSecret)) {
                nextSecret = this.knownSecretNumbers.get(prevSecret)!;
            } else {
                nextSecret = this.mixPrune(prevSecret, prevSecret * 64n);
                nextSecret = this.mixPrune(nextSecret, nextSecret >> 5n);
                nextSecret = this.mixPrune(nextSecret, nextSecret * 2048n);
                this.knownSecretNumbers.set(prevSecret, nextSecret);
            }
            prevSecret = nextSecret;
        }
        return Number(prevSecret);
    }

    private static mixPrune(secretNumber: bigint, value: bigint) {
        return (secretNumber ^ value) % 16777216n;
    }
}
