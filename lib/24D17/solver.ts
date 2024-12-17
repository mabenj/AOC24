import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;
// const EXAMPLE = `Register A: 2024
// Register B: 0
// Register C: 0

// Program: 0,3,5,4,3,0`;

export default class Solver24D17 implements PuzzleSolver {
    private registerA = 0;
    private program: number[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
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
            switch (opCode) {
                case 0:
                    registers["A"] = Math.floor(
                        registers["A"] / Math.pow(2, combo(operand))
                    );
                    break;
                case 1:
                    registers["B"] ^= operand;
                    break;
                case 2:
                    registers["B"] = combo(operand) % 8;
                    break;
                case 3:
                    ip = registers["A"] === 0 ? ip : operand;
                    break;
                case 4:
                    registers["B"] ^= registers["C"];
                    break;
                case 5:
                    output.push(combo(operand) % 8);
                    break;
                case 6:
                    registers["B"] = Math.floor(
                        registers["A"] / Math.pow(2, combo(operand))
                    );
                    break;
                case 7:
                    registers["C"] = Math.floor(
                        registers["A"] / Math.pow(2, combo(operand))
                    );
                    break;
            }
        }

        return output.join(",");
    }

    solvePart2() {
        return -1;
    }
}
