import { assert } from "@std/assert/assert";
import { objectKeys } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
`;

type Gate = {
    type: "AND" | "OR" | "XOR";
    inputs: [WireObservable, WireObservable];
    output: WireObservable;
};

export default class Solver24D24 implements PuzzleSolver {
    private wires: { [name: string]: WireObservable } = {};
    private gates: Gate[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        for (const line of input.filter((line) => !!line)) {
            const wireMatch = line.match(/(?<name>.+): (?<value>[0|1]{1})/);
            if (wireMatch) {
                const { groups: { name, value } = {} } = wireMatch;
                this.wires[name] = new WireObservable(value === "1");
            }
            const gateMatch = line.match(
                /(?<input1>.+) (?<type>.+) (?<input2>.+) -> (?<output>.+)/
            );
            if (gateMatch) {
                const { groups = {} } = gateMatch;
                this.wires[groups.input1!] ??= new WireObservable();
                this.wires[groups.input2!] ??= new WireObservable();
                this.wires[groups.output!] ??= new WireObservable();
                const input1 = this.wires[groups.input1!];
                const input2 = this.wires[groups.input2!];
                const output = this.wires[groups.output!];
                this.gates.push({
                    type: groups.type as "AND" | "OR" | "XOR",
                    inputs: [input1, input2],
                    output,
                });
            }
        }
    }

    async solvePart1() {
        const outputPromises: Promise<void>[] = [];
        for (const gate of this.gates) {
            const inputPromises = gate.inputs.map(
                (input) =>
                    new Promise<boolean>((resolve) => input.subscribe(resolve))
            );
            const outputPromise = Promise.all(inputPromises).then(
                ([input1Value, input2Value]) => {
                    if (gate.type === "AND") {
                        gate.output.notify(input1Value && input2Value);
                    } else if (gate.type === "OR") {
                        gate.output.notify(input1Value || input2Value);
                    } else if (gate.type === "XOR") {
                        gate.output.notify(input1Value !== input2Value);
                    }
                }
            );
            outputPromises.push(outputPromise);
        }

        await Promise.all(outputPromises);

        const binaryOutput = objectKeys(this.wires)
            .filter((wireName) => wireName.startsWith("z"))
            .sort()
            .reverse()
            .map((wireName) => (this.wires[wireName]!.currentValue ? 1 : 0))
            .join("");

        return parseInt(binaryOutput, 2);
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

class WireObservable {
    private observers: ((value: boolean) => void)[] = [];

    constructor(private value?: boolean) {}

    get currentValue() {
        return this.value;
    }

    subscribe(callback: (value: boolean) => void) {
        if (typeof this.value === "boolean") {
            callback(this.value);
        } else {
            this.observers.push(callback);
        }
    }

    notify(value: boolean) {
        this.value = value;
        this.observers.forEach((callback) => callback(value));
        this.observers = [];
    }
}
