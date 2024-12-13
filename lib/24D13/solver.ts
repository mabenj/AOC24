import { PuzzleSolver } from "../types/puzzle-solver.ts";

const BTN_PATTERN =
    /Button (?<type>[A|B]{1}): X\+(?<x>[0-9]+), Y\+(?<y>[0-9]+)/;
const PRIZE_PATTERN = /Prize: X=(?<x>[0-9]+), Y=(?<y>[0-9]+)/;

type ArcadeMachine = {
    buttonA: { dx: number; dy: number; cost: number };
    buttonB: { dx: number; dy: number; cost: number };
    priceCoords: { x: number; y: number };
};

export default class Solver24D13 implements PuzzleSolver {
    private machines: ArcadeMachine[] = [];

    parseInput(input: string[]) {
        const parseButton = (line: string) => {
            const { groups: { x, y, type } = {} } = line.match(BTN_PATTERN)!;
            return { dx: +x, dy: +y, cost: type === "A" ? 3 : 1 };
        };

        const parsePrize = (line: string) => {
            const { groups: { x, y } = {} } = line.match(PRIZE_PATTERN)!;
            return { x: +x, y: +y };
        };

        for (let i = 0; i + 2 < input.length; i += 4) {
            this.machines.push({
                buttonA: parseButton(input[i]),
                buttonB: parseButton(input[i + 1]),
                priceCoords: parsePrize(input[i + 2]),
            });
        }
    }

    solvePart1() {
        return this.calculateTokens(0);
    }

    solvePart2() {
        return this.calculateTokens(10_000_000_000_000);
    }

    private calculateTokens(prizeOffset: number) {
        let tokens = 0;
        for (const machine of this.machines) {
            const { buttonA, buttonB, priceCoords } = machine;
            const { x, y } = cramersRule(
                buttonA.dx,
                buttonA.dy,
                buttonB.dx,
                buttonB.dy,
                priceCoords.x + prizeOffset,
                priceCoords.y + prizeOffset
            );
            if (Number.isInteger(x) && Number.isInteger(y)) {
                tokens += x * buttonA.cost + y * buttonB.cost;
            }
        }
        return tokens;
    }
}

// https://en.wikipedia.org/wiki/Cramer%27s_rule
function cramersRule(
    a1: number,
    a2: number,
    b1: number,
    b2: number,
    c1: number,
    c2: number
) {
    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;
    return { x: Dx / D, y: Dy / D };
}
