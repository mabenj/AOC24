import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D17 implements PuzzleSolver {
    private registerA = 0;
    private program: number[] = [];

    parseInput(input: string[]) {
        this.registerA = +input[0].split(": ")[1];
        this.program = input[4].split(": ")[1].split(",").map(Number);
    }

    solvePart1() {
        const registers = { A: this.registerA, B: 0, C: 0 };
        const output: number[] = [];

        const combo = (literal: number) => {
            if (literal <= 3) return literal;
            if (literal === 4) return registers["A"];
            if (literal === 5) return registers["B"];
            if (literal === 6) return registers["C"];
            throw new Error(`Invalid operand ${literal}`);
        };

        let ip = 0;
        while (ip < this.program.length) {
            const opCode = this.program[ip++];
            const operand = this.program[ip++];
            if (opCode === 0) {
                registers["A"] = registers["A"] >> combo(operand);
            } else if (opCode === 1) {
                registers["B"] ^= operand;
            } else if (opCode === 2) {
                registers["B"] = combo(operand) % 8;
            } else if (opCode === 3) {
                ip = registers["A"] === 0 ? ip : operand;
            } else if (opCode === 4) {
                registers["B"] ^= registers["C"];
            } else if (opCode === 5) {
                output.push(combo(operand) % 8);
            } else if (opCode === 6) {
                registers["B"] = registers["A"] >> combo(operand);
            } else if (opCode === 7) {
                registers["C"] = registers["A"] >> combo(operand);
            }
        }

        return output.join(",");
    }

    // Note: this only works for program: 2, 4, 1, 2, 7, 5, 4, 3, 0, 3, 1, 7, 5, 5, 3, 0
    solvePart2() {
        const PROGRAM = [2, 4, 1, 2, 7, 5, 4, 3, 0, 3, 1, 7, 5, 5, 3, 0];
        //               B = A % 8
        //                     B = B ^ 2
        //                           C = A >> B
        //                                 B = B ^ C
        //                                       A = A >> 3
        //                                             B = B ^ 7
        //                                                    out(B % 8)
        //                                                          if A != 0 jump to beginning

        const find = (
            program: bigint[],
            answerSoFar: bigint
        ): bigint | null => {
            if (program.length === 0) {
                return answerSoFar;
            }
            const target = program.at(-1);
            const registers = { A: 0n, B: 0n, C: 0n };
            for (const possibleB of [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n]) {
                registers["A"] = (answerSoFar << 3n) + possibleB;

                registers["B"] = possibleB; // this is same as B = A % 8
                registers["B"] = registers["B"] ^ 2n;
                registers["C"] = registers["A"] >> registers["B"];
                registers["B"] = registers["B"] ^ registers["C"];
                registers["B"] = registers["B"] ^ 7n;

                const isPotentialSolution = registers["B"] % 8n === target;
                if (isPotentialSolution) {
                    const subAnswer = find(
                        program.slice(0, program.length - 1),
                        registers["A"]
                    );
                    if (subAnswer != null) {
                        return subAnswer;
                    }
                }
            }

            return null;
        };

        return Number(find(PROGRAM.map(BigInt), 0n));
    }
}
