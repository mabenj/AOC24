import * as path from "jsr:@std/path";
import { prettyNumber } from "../common.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { NodeHtmlMarkdown } from "npm:node-html-markdown";

export default async function init(year: string, day: string) {
    const startTime = performance.now();
    const id = `${year}D${day}`;

    const puzzle = await fetchPuzzle(year, day);
    const input = await fetchInput(year, day);
    const solverClass = generateSolverClass(id);

    const directoryPath = path.join("lib", id);
    const inputPath = path.join(directoryPath, "input.txt");
    const puzzlePath = path.join(directoryPath, "README.md");
    const solverPath = path.join(directoryPath, "solver.ts");

    console.log(`Creating directory %c${directoryPath}`, "color: gray");
    await Deno.mkdir(directoryPath, { recursive: true });
    await writeFileIfNotExists(inputPath, input);
    await writeFileOverwrite(puzzlePath, puzzle);
    await writeFileIfNotExists(solverPath, solverClass);

    const endTime = performance.now();

    console.log(
        `${id} initialized successfully %c(${prettyNumber(
            endTime - startTime
        )}ms)`,
        "color: gray"
    );
    console.log(
        "Do not forget to update 'lib/solver-factory.ts' with the new solver!"
    );
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

async function fetchPuzzle(year: string, day: string) {
    const puzzleUrl = `https://adventofcode.com/20${year}/day/${day}`;

    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }

    console.log(`Fetching puzzle from %c${puzzleUrl}`, "color: gray");
    const res = await fetch(puzzleUrl, {
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

async function fetchInput(year: string, day: string) {
    const inputUrl = `https://adventofcode.com/20${year}/day/${day}/input`;

    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }

    console.log(`Fetching input from %c${inputUrl}`, "color: gray");
    const res = await fetch(inputUrl, {
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

async function writeFileOverwrite(path: string, content: string) {
    console.log(`Writing file to %c${path}`, "color: gray");
    await Deno.writeTextFile(path, content);
}

async function writeFileIfNotExists(path: string, content: string) {
    try {
        await Deno.lstat(path);
        console.log(
            `File %c${path}%c already exists! Skipping...`,
            "color: gray",
            "color: white"
        );
        return;
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
    }

    await writeFileOverwrite(path, content);
}
