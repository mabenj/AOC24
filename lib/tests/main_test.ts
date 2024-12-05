import { assertEquals, assertExists } from "@std/assert";
import SolverFactory from "../solver-factory.ts";
import * as path from "jsr:@std/path";
import { fileExists, LINE_SEPARATOR } from "../common.ts";

const answers = await getCorrectAnswers();
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
            const expected = answers[id][part - 1];
            assertEquals(output, expected, `Incorrect output`);
        }
    });
}

async function getCorrectAnswers(): Promise<{
    [id: string]: (string | number)[];
}> {
    const answersPath = path.join("lib", "tests", "main_test_answers.json");
    if (!(await fileExists(answersPath))) {
        throw new Error(`Answers file not found at ${answersPath}`);
    }

    return JSON.parse(await Deno.readTextFile(answersPath));
}
