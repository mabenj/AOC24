import { objectKeys } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

type Gate = {
    type: string;
    inputs: [string, string];
    output: string;
};

export default class Solver24D24 implements PuzzleSolver {
    private wires: { [name: string]: number } = {};
    private gates: { [outputName: string]: Gate } = {};

    parseInput(input: string[]) {
        for (const line of input.filter((line) => !!line)) {
            const wireMatch = line.match(/(?<name>.+): (?<value>[0|1]{1})/);
            if (wireMatch) {
                const { groups: { name, value } = {} } = wireMatch;
                this.wires[name] = +value;
            }
            const gateMatch = line.match(
                /(?<input1>.+) (?<type>.+) (?<input2>.+) -> (?<output>.+)/
            );
            if (gateMatch) {
                const { groups: { input1, input2, output, type } = {} } =
                    gateMatch;
                this.gates[output] = { type, inputs: [input1, input2], output };
            }
        }
    }

    solvePart1() {
        const getWireValue = (wireName: string): number => {
            if (typeof this.wires[wireName] === "number") {
                return this.wires[wireName];
            }

            const gate = this.gates[wireName];
            const [left, right] = gate.inputs.map((input) =>
                getWireValue(input)
            );
            if (gate.type === "AND") this.wires[wireName] = left & right;
            if (gate.type === "OR") this.wires[wireName] = left | right;
            if (gate.type === "XOR") this.wires[wireName] = left ^ right;

            return this.wires[wireName];
        };

        const outputBinary = objectKeys(this.gates)
            .filter((output) => output.startsWith("z"))
            .sort()
            .reverse()
            .map((output) => getWireValue(output))
            .join("");

        return parseInt(outputBinary, 2);
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}
