import { LINE_SEPARATOR, prettyNumber } from "../common.ts";
import SolverFactory from "../solver-factory.ts";
import * as path from "jsr:@std/path";

export default async function solve(year: string, day: string, part: string) {
    const puzzleId = `${year}D${day}`;
    try {
        const solver = SolverFactory.getSolver(puzzleId);
        const solveMethod =
            part === "1"
                ? () => solver.solvePart1()
                : () => solver.solvePart2();

        const input = await Deno.readTextFile(
            path.join("lib", puzzleId, "input.txt")
        );
        if (!input) {
            throw new Error(`No input found for ${puzzleId}`);
        }

        const startTime = performance.now();
        solver.parseInput(input.split(LINE_SEPARATOR));
        const output = solveMethod();
        const endTime = performance.now();

        console.log(
            `Solved ${puzzleId} part ${part}: %c${output} %c(${prettyNumber(
                endTime - startTime
            )}ms)`,
            "color: green",
            "color: gray"
        );
    } catch (e) {
        console.error(
            `%cError while solving ${puzzleId} part ${part}`,
            "color: red"
        );
        throw e;
    }
}
