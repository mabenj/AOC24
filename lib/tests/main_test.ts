import { assertEquals, assertExists } from "@std/assert";
import SolverFactory from "../solver-factory.ts";
import * as path from "jsr:@std/path";
import { LINE_SEPARATOR } from "../common.ts";

const ANSWERS: { [id: string]: (string | number)[] } = {
    "23D1": [54644, 53348],
    "23D2": [2176, 63700],
    "23D3": [536576, 75741499],
    "24D1": [2344935, 27647262],
    "24D2": [421, 476],
    "24D3": [157621318, 79845780],
    "24D4": [2560, 1910],
};

const solverIds = SolverFactory.getSolverIds();

for (const id of solverIds) {
    Deno.test(`Solver ${id} works as expected`, async () => {
        const input = await Deno.readTextFile(
            path.join("lib", id, "input.txt")
        );
        assertExists(input, `No input`);
        const solver = SolverFactory.getSolver(id);
        solver.parseInput(input.split(LINE_SEPARATOR));
        for (const part of [1, 2]) {
            const output =
                part === 1 ? solver.solvePart1() : solver.solvePart2();
            const expected = ANSWERS[id][part - 1];
            assertEquals(output, expected, `Incorrect output`);
        }
    });
}
