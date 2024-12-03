import * as path from "jsr:@std/path";
import { prettyNumber } from "../common.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { NodeHtmlMarkdown } from "npm:node-html-markdown";

export default async function init(year: string, day: string) {
    const startTime = performance.now();
    const id = `${year}D${day}`;
    const existingSolvers = await getExistingSolverIds();

    const puzzle = await fetchPuzzle(year, day);
    const input = await fetchInput(year, day);
    const solverClass = generateSolverClass(id);
    const solverFactoryClass = await generateSolverFactoryClass([
        ...existingSolvers,
        id,
    ]);

    const directoryPath = path.join("lib", id);
    const inputPath = path.join(directoryPath, "input.txt");
    const puzzlePath = path.join(directoryPath, "README.md");
    const solverPath = path.join(directoryPath, "solver.ts");
    const factoryPath = path.join("lib", "solver-factory.ts");

    console.log(`Creating directory %c${directoryPath}`, "color: gray");
    await Deno.mkdir(directoryPath, { recursive: true });
    await writeFileIfNotExists(inputPath, input);
    await writeFileOverwrite(puzzlePath, puzzle);
    await writeFileIfNotExists(solverPath, solverClass);
    await writeFileOverwrite(factoryPath, solverFactoryClass);

    const endTime = performance.now();

    console.log(
        `${id} initialized successfully %c(${prettyNumber(
            endTime - startTime
        )}ms)`,
        "color: gray"
    );
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
    if (await fileExists(path)) {
        console.log(
            `File %c${path}%c already exists! Skipping...`,
            "color: gray",
            "color: white"
        );
        return;
    }

    await writeFileOverwrite(path, content);
}

async function fileExists(path: string) {
    try {
        await Deno.lstat(path);
        return true;
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        return false;
    }
}

async function getExistingSolverIds() {
    const result: string[] = [];
    const libDirs = Array.from(Deno.readDirSync("lib")).filter(
        (entry) => entry.isDirectory
    );
    for (const dir of libDirs) {
        const solverPath = path.join("lib", dir.name, "solver.ts");
        if (await fileExists(solverPath)) {
            result.push(dir.name);
        }
    }
    return result;
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

function generateSolverFactoryClass(ids: string[]) {
    ids = [...new Set(ids)];
    const imports = ids
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((id) => `import Solver${id} from "./${id}/solver.ts";`)
        .join("\n");
    const registrations = ids
        .map(
            (id) =>
                `        SolverFactory.registerSolver("${id}", new Solver${id}());`
        )
        .join("\n");

    return `import { PuzzleSolver } from "./types/puzzle-solver.ts";
${imports}

export default class SolverFactory {
    private static readonly solverMap: { [id: string]: PuzzleSolver } = {};

    private constructor() {}

    static {
${registrations}
    }

    static getSolver(id: string): PuzzleSolver {
        const solver = this.solverMap[id];
        if (solver) {
            return solver;
        }
        throw new Error(\`No solver found for \${id}\`);
    }

    static getSolverIds(): string[] {
        return Object.keys(this.solverMap);
    }

    private static registerSolver(id: string, solver: PuzzleSolver) {
        this.solverMap[id] = solver;
    }
}`;
}
