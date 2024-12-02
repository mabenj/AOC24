import { readFile, writeFile } from "fs/promises";
import path from "path";
import { prettyNumber } from "./utils";
import { Day1Part1 } from "./day1/part1";
import { Day1Part2 } from "./day1/part2";
import { PuzzleSolver } from "./types/puzzle-solver";
import { Day2Part1 } from "./day2/part1";
import { Day2Part2 } from "./day2/part2";

async function main(args: string[]) {
    const [puzzleId] = args;
    const [day, part] = puzzleId?.split(".") ?? ["", ""];

    if (!day || !part) {
        console.log("Usage: pnpm run solve <day.part>");
        return -1;
    }

    try {
        const solver = SolverFactory.getSolver(puzzleId);

        const input = await readFile(
            path.join("src", `day${day}`, "input.txt"),
            "utf-8"
        );
        if (!input) {
            console.log(`No input found for day${day} part${part}`);
            return -1;
        }

        const startTime = performance.now();
        const result = solver.solve(input);
        const endTime = performance.now();
        console.log(
            `Solved day${day} part${part} in ${prettyNumber(
                endTime - startTime
            )}ms`
        );

        const outputPath = path.join(
            "src",
            `day${day}`,
            `output_part${part}.txt`
        );
        console.log(`Writing output '${result}' to '${outputPath}'`);
        await writeFile(outputPath, result);

        return 0;
    } catch (e) {
        console.error(e);
        return -1;
    }
}

class SolverFactory {
    private static readonly solverMap: Record<string, PuzzleSolver> = {
        "1.1": new Day1Part1(),
        "1.2": new Day1Part2(),
        "2.1": new Day2Part1(),
        "2.2": new Day2Part2(),
    };

    private constructor() {}

    static getSolver(puzzleId: string): PuzzleSolver {
        const solver = this.solverMap[puzzleId];
        if (solver) {
            return solver;
        }
        throw new Error(`No solver found for '${puzzleId}'`);
    }
}

main(process.argv.slice(2));
