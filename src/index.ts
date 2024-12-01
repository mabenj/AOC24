import { readFile, writeFile } from "fs/promises";
import path from "path";
import { SolverMap } from "./solver-map";
import { prettyNumber } from "./utils";

const args = process.argv.slice(2);

async function main() {
  const [puzzleId] = args;
  const [day, part] = puzzleId?.split(".") ?? ["", ""];

  if (!day || !part) {
    console.log("Usage: pnpm run solve <day.part>");
    return -1;
  }

  const solver = SolverMap.getSolver(puzzleId);
  if (!solver) {
    console.log(`No solver found for day${day} part${part}`);
    return -1;
  }

  try {
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
      `Solved day${day} part${part} in ${prettyNumber(endTime - startTime)}ms`
    );

    const outputPath = path.join(
      "src",
      `day${day}`,
      `output_day${day}_part${part}.txt`
    );
    console.log(`Writing output to '${outputPath}'`);
    await writeFile(outputPath, result);

    return 0;
  } catch (e) {
    console.error(e);
    return -1;
  }
}

main();
