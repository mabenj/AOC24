import * as path from "jsr:@std/path";
import { prettyNumber } from "../common.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import {
    NodeHtmlMarkdown,
    NodeHtmlMarkdownOptions,
} from "npm:node-html-markdown";

export default async function init(year: string, day: string) {
    const startTime = performance.now();
    const id = `${year}D${day}`;
    const inputUrl = `https://adventofcode.com/20${year}/day/${day}/input`;
    const puzzleUrl = `https://adventofcode.com/20${year}/day/${day}`;

    console.log(`Fetching input from %c${inputUrl}`, "color: gray");
    const input = await fetchInput(inputUrl);
    console.log(`Fetching puzzle from %c${puzzleUrl}`, "color: gray");
    const puzzle = await fetchPuzzle(puzzleUrl);
    const solverClass = generateSolverClass(id);

    const directoryPath = path.join("lib", id);
    const inputPath = path.join(directoryPath, "input.txt");
    const puzzlePath = path.join(directoryPath, "README.md");
    const solverPath = path.join(directoryPath, "solver.ts");

    console.log(`Creating directory %c${directoryPath}`, "color: gray");
    await Deno.mkdir(directoryPath, { recursive: true });
    console.log(`Writing input to %c${inputPath}`, "color: gray");
    await Deno.writeTextFile(inputPath, input);
    console.log(`Writing puzzle to %c${puzzlePath}`, "color: gray");
    await Deno.writeTextFile(puzzlePath, puzzle);
    console.log(`Writing solver to %c${solverPath}`, "color: gray");
    await Deno.writeTextFile(solverPath, solverClass);

    const endTime = performance.now();

    console.log(
        `${id} initialized %csuccessfully %c(${prettyNumber(
            endTime - startTime
        )}ms)`,
        "color: green",
        "color: gray"
    );
    console.log(
        "Do not forget to update 'lib/solver-factory.ts' with the new solver!"
    );
}

async function fetchInput(url: string) {
    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }
    const res = await fetch(url, {
        headers: { cookie: `session=${Deno.env.get("AOC_SESSION")}` },
    });
    if (!res.ok) {
        throw new Error(
            `Failed to fetch input: ${res.status} (${res.statusText})`
        );
    }
    const input = await res.text();
    return input;
}

async function fetchPuzzle(url: string) {
    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }
    const res = await fetch(url, {
        headers: { cookie: `session=${Deno.env.get("AOC_SESSION")}` },
    });
    if (!res.ok) {
        throw new Error(
            `Failed to fetch puzzle: ${res.status} (${res.statusText})`
        );
    }
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const puzzle = Array.from(doc.querySelectorAll(".day-desc"))
        .map((el) => el.innerHTML || "")
        .join("\n");
    const nhm = new NodeHtmlMarkdown();
    const markdown = nhm.translate(puzzle);
    return markdown;
}

function generateSolverClass(id: string) {
    return `import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver${id} implements PuzzleSolver {

    parseInput(input: string[]) {
        throw new Error("Method not implemented.");
    }

    solvePart1(): number | string {
        throw new Error("Method not implemented.");
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}`;
}
