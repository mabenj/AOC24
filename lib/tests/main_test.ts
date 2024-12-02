import { assertEquals, assertExists } from "@std/assert";
import SolverFactory from "../solver-factory.ts";
import * as path from "jsr:@std/path";
import { PuzzleSolver } from "../types/puzzle-solver.ts";
import { LINE_SEPARATOR } from "../common.ts";

const ANSWERS: { [id: string]: (string | number)[] } = {
    "23D1": [54644, 53348],
    "23D2": [2176, 63700],
    "23D3": [536576, -1],
    "24D1": [2344935, 27647262],
    "24D2": [421, 476],
};

const solverIds = SolverFactory.getSolverIds();

for (const id of solverIds) {
    Deno.test(`Solver ${id} works as expected`, async (t) => {
        let solver: PuzzleSolver;
        await t.step("solver exists", () => {
            solver = SolverFactory.getSolver(id);
        });
        await t.step(`solver can parse input`, async () => {
            const input = await Deno.readTextFile(
                path.join("lib", id, "input.txt")
            );
            assertExists(input, `No input found for ${id}`);
            solver.parseInput(input.split(LINE_SEPARATOR));
        });
        await t.step(`solver can solve part 1`, () => {
            const output = solver.solvePart1();
            assertEquals(
                output,
                ANSWERS[id][0],
                `Incorrect output for ${id} part 1`
            );
        });
        await t.step(`solver can solve part 2`, () => {
            const output = solver.solvePart2();
            assertEquals(
                output,
                ANSWERS[id][1],
                `Incorrect output for ${id} part 2`
            );
        });
    });
}
