import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

export default class Solver24D17 implements PuzzleSolver {
    private computer!: Computer;

    parseInput(input: string[]) {
        input = EXAMPLE.split("\n");
        this.computer = new Computer(
            +input[0].split(": ")[1],
            input[4].split(": ")[1].split(",").map(Number)
        );
    }

    solvePart1() {
        const output = this.computer.run();
        return output;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

class Computer {
    private readonly instructionMap: Record<
        number,
        (operand: number) => number | void
    > = {
        0: this.handleAdv.bind(this),
        1: this.handleBxl.bind(this),
        2: this.handleBst.bind(this),
        3: this.handleJnz.bind(this),
        4: this.handleBxc.bind(this),
        5: this.handleOut.bind(this),
        6: this.handleBdv.bind(this),
        7: this.handleCdv.bind(this),
    };
    private readonly program: number[];
    private readonly registers: Record<string, number> = {
        A: 0,
        B: 0,
        C: 0,
    };
    private ip = 0;

    constructor(registerA: number, program: number[]) {
        this.program = program;
        this.writeRegister("A", registerA);
        this.writeRegister("B", 0);
        this.writeRegister("C", 0);
    }

    run() {
        const output: number[] = [];
        while (this.ip + 1 < this.program.length) {
            const instruction = this.program[this.ip];
            const operand = this.program[this.ip + 1];
            const result = this.instructionMap[instruction](operand);
            if (typeof result === "number") {
                output.push(result);
            }
            this.ip += 2;
        }
        return output.join(",");
    }

    private handleAdv(operand: number) {
        const numerator = this.readRegister("A");
        const denominator = Math.pow(2, this.getComboOperandValue(operand));
        this.writeRegister("A", Math.floor(numerator / denominator));
    }

    private handleBxl(operand: number) {
        this.writeRegister("B", this.readRegister("B") ^ operand);
    }

    private handleBst(operand: number) {
        this.writeRegister("B", this.getComboOperandValue(operand) % 8);
    }

    private handleJnz(operand: number) {
        const valueA = this.readRegister("A");
        if (valueA === 0) {
            return;
        }
        this.ip = operand - 2; // -2 negates the increment
    }

    private handleBxc(_: number) {
        this.writeRegister(
            "B",
            this.readRegister("B") ^ this.readRegister("C")
        );
    }

    private handleOut(operand: number) {
        return this.getComboOperandValue(operand) % 8;
    }

    private handleBdv(operand: number) {
        const numerator = this.readRegister("A");
        const denominator = Math.pow(2, this.getComboOperandValue(operand));
        this.writeRegister("B", Math.floor(numerator / denominator));
    }

    private handleCdv(operand: number) {
        const numerator = this.readRegister("A");
        const denominator = Math.pow(2, this.getComboOperandValue(operand));
        this.writeRegister("C", Math.floor(numerator / denominator));
    }

    private getComboOperandValue(operand: number) {
        switch (operand) {
            case 0:
            case 1:
            case 2:
            case 3:
                return operand;
            case 4:
                return this.readRegister("A");
            case 5:
                return this.readRegister("B");
            case 6:
                return this.readRegister("C");
            default:
                throw new Error(`Invalid operand: ${operand}`);
        }
    }

    private writeRegister(register: string, value: number) {
        console.log(
            `WRITE %c${register} = %c${value}`,
            "color: gray",
            "color: white"
        );
        this.registers[register] = value;
    }

    private readRegister(register: string): number {
        console.log(
            `READ %c${register} = %c${this.registers[register]}`,
            "color: gray",
            "color: white"
        );
        return this.registers[register];
    }
}
