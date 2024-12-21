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

    solvePart2() {
        return -1;
    }
}
