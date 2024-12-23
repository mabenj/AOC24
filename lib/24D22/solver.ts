import { assert } from "@std/assert/assert";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const SECRET_COUNT = 2000;

export default class Solver24D22 implements PuzzleSolver {
    private secretNumbers: number[] = [];

    parseInput(input: string[]) {
        this.secretNumbers = input.filter((line) => !!line).map(Number);
    }

    solvePart1() {
        return this.secretNumbers.reduce((acc, secretNumber) => {
            const nextSecret = getSecrets(secretNumber).toArray().at(-1);
            assert(nextSecret !== undefined);
            return acc + nextSecret;
        }, 0);
    }

    solvePart2() {
        const sequenceTally = new Map<string, number>();

        for (const seed of this.secretNumbers) {
            const processedSequences = new Set<string>();
            const last5: number[] = [];
            for (const secretNumber of getSecrets(seed)) {
                last5.push(secretNumber);
                if (last5.length < 5) continue;
                if (last5.length > 5) last5.shift();

                const sequence = last5
                    .map((secret) => secret % 10)
                    .map((price, index, prices) => {
                        if (index === 0) return null;
                        return price - prices[index - 1];
                    })
                    .filter((delta) => delta !== null)
                    .join(",");
                const price = last5[4] % 10;

                if (processedSequences.has(sequence)) continue;

                processedSequences.add(sequence);
                sequenceTally.set(
                    sequence,
                    (sequenceTally.get(sequence) || 0) + price
                );
            }
        }

        return Math.max(...sequenceTally.values());
    }
}

function* getSecrets(secret: number) {
    let i = 0;
    while (i++ < SECRET_COUNT) {
        secret = (secret ^ (secret << 6)) & 16777215;
        secret = (secret ^ (secret >> 5)) & 16777215;
        secret = (secret ^ (secret << 11)) & 16777215;
        yield secret;
    }
}
