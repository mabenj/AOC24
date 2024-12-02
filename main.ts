import { parseArgs } from "jsr:@std/cli/parse-args";
import * as path from "jsr:@std/path";
import SolverFactory from "./lib/solver-factory.ts";
import { LINE_SEPARATOR, prettyNumber } from "./lib/common.ts";

async function main(identifier: string, part: string) {
    try {
        const solver = SolverFactory.getSolver(identifier);
        const solveMethod =
            part === "1"
                ? () => solver.solvePart1()
                : () => solver.solvePart2();

        const input = await Deno.readTextFile(
            path.join("lib", identifier, "input.txt")
        );
        if (!input) {
            console.log(`%cNo input found for ${identifier}`, "color: red");
            return -1;
        }

        const startTime = performance.now();
        solver.parseInput(input.split(LINE_SEPARATOR));
        const output = solveMethod();
        const endTime = performance.now();

        console.log(
            `Solved ${identifier} part ${part} in %c${prettyNumber(
                endTime - startTime
            )}ms %cwith output: %c${output}`,
            "color: green",
            "color: white",
            "color: blue"
        );

        return 0;
    } catch (e) {
        console.error(
            `%cError while solving ${identifier} part ${part}`,
            "color: red"
        );
        console.error(e);
        return -1;
    }
}

if (import.meta.main) {
    const flags = parseArgs(Deno.args, {
        string: ["d", "day", "p", "part", "y", "year"],
    });
    const day = flags.d || flags.day;
    const part = flags.p || flags.part || "1";
    const year = flags.y || flags.year || "24";
    if (!day || !["1", "2"].includes(part)) {
        console.log("Usage: main.ts -d <day> -p <1 | 2>");
        Deno.exit(1);
    }
    const exitCode = await main(`${year}D${day}`, part);
    Deno.exit(exitCode || -1);
}
