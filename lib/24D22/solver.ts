import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `1
2
3
2024`;

export default class Solver24D22 implements PuzzleSolver {
    private secretNumbers: number[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        this.secretNumbers = input.filter((line) => !!line).map(Number);
    }

    solvePart1() {
        return this.secretNumbers.reduce(
            (acc, secretNumber) =>
                acc + SecretNumberGenerator.getNth(secretNumber, 2000),
            0
        );
    }

    solvePart2() {
        const sequenceToPriceMaps = this.secretNumbers.map((secretNumber) =>
            SecretNumberGenerator.getSequencesWithPrice(secretNumber, 2000)
        );
        const distinctSequences = new Set<string>(
            sequenceToPriceMaps.flatMap((map) => Array.from(map.keys()))
        );

        let bestPrice = 0;
        for (const sequence of distinctSequences) {
            const totalPrice = sequenceToPriceMaps.reduce((acc, currentMap) => {
                return acc + (currentMap.get(sequence) || 0);
            }, 0);
            if (totalPrice > bestPrice) {
                bestPrice = totalPrice;
            }
        }

        return bestPrice;
    }
}

class SecretNumberGenerator {
    private static knownSecretNumbers = new Map<bigint, bigint>();

    static getNth(seed: number, n: number) {
        let prevSecret = BigInt(seed);
        for (let i = 0; i < n; i++) {
            prevSecret = this.getNextSecret(prevSecret);
        }
        return Number(prevSecret);
    }

    static getSequencesWithPrice(seed: number, n: number) {
        const sequenceToPrice = new Map<string, number>();

        let prevSecret = BigInt(seed);
        const pricesOfLast5 = [prevSecret % 10n];
        for (let i = 0; i < n; i++) {
            const nextSecret = this.getNextSecret(prevSecret);
            pricesOfLast5.push(nextSecret % 10n);
            if (pricesOfLast5.length > 5) {
                pricesOfLast5.shift();
            }
            if (pricesOfLast5.length === 5) {
                const deltas = pricesOfLast5
                    .map((price, index) => {
                        const prevPrice = pricesOfLast5[index - 1];
                        if (index === 0) {
                            return null;
                        }
                        return price - prevPrice;
                    })
                    .filter((delta) => delta !== null);
                const sequence = deltas.join(",");
                if (!sequenceToPrice.has(sequence)) {
                    sequenceToPrice.set(sequence, Number(pricesOfLast5[4]));
                }
            }

            prevSecret = nextSecret;
        }

        return sequenceToPrice;
    }

    private static getNextSecret(prevSecret: bigint) {
        if (!this.knownSecretNumbers.has(prevSecret)) {
            let nextSecret = this.mixPrune(prevSecret, prevSecret * 64n);
            nextSecret = this.mixPrune(nextSecret, nextSecret >> 5n);
            nextSecret = this.mixPrune(nextSecret, nextSecret * 2048n);
            this.knownSecretNumbers.set(prevSecret, nextSecret);
        }
        return this.knownSecretNumbers.get(prevSecret)!;
    }

    private static mixPrune(secretNumber: bigint, value: bigint) {
        return (secretNumber ^ value) % 16777216n;
    }
}
