import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D3 implements PuzzleSolver {
    private input = "";
    private sum = 0;
    private isDoEnabled = true;

    parseInput(input: string[]) {
        this.input = input.join("");
    }

    solvePart1() {
        return this.solve(false);
    }

    solvePart2() {
        return this.solve(true);
    }

    private solve(useConditionals: boolean) {
        const HANDLERS = [
            {
                keyword: "mul(",
                handle: this.handleMul.bind(this),
                enabled: true,
            },
            {
                keyword: "do()",
                handle: this.handleDo.bind(this),
                enabled: useConditionals,
            },
            {
                keyword: "don't()",
                handle: this.handleDont.bind(this),
                enabled: useConditionals,
            },
        ];

        this.isDoEnabled = true;
        this.sum = 0;
        let remaining = this.input;
        while (remaining.length > 0) {
            const handler = HANDLERS.find(
                (h) => h.enabled && remaining.startsWith(h.keyword)
            );
            if (handler) {
                handler.handle(remaining);
                remaining = remaining.substring(handler.keyword.length);
            } else {
                remaining = remaining.substring(1);
            }
        }
        return this.sum;
    }

    private handleMul(currentInput: string) {
        if (!this.isDoEnabled) {
            return;
        }
        const startIndex = currentInput.indexOf("(");
        const endIndex = currentInput.indexOf(")");
        const args = currentInput.substring(startIndex + 1, endIndex);
        const [a, b, ...rest] = args.split(",");
        if (isValidNumber(a) && isValidNumber(b) && rest.length === 0) {
            this.sum += parseInt(a, 10) * parseInt(b, 10);
        }
    }

    private handleDo() {
        this.isDoEnabled = true;
    }

    private handleDont() {
        this.isDoEnabled = false;
    }
}

function isValidNumber(str: string): boolean {
    return str
        .split("")
        .every((c) =>
            ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(c)
        );
}
