import * as path from "jsr:@std/path";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { NodeHtmlMarkdown } from "npm:node-html-markdown";
import { prettyDuration } from "../common.ts";

export default async function init(year: string, day: string) {
    const id = `${year}D${day}`;
    console.log(`Initializing %c${id}`, "color: blue");

    const startTime = performance.now();
    const directoryPath = path.join("lib", id);
    await Deno.mkdir(directoryPath, { recursive: true });
    await initializePuzzle(year, day, directoryPath);
    await initializeInput(year, day, directoryPath);
    await initializeSolver(year, day, directoryPath);
    await initializeSolverFactory();
    const endTime = performance.now();

    console.log(
        `%c${id}%c initialized successfully %c(${prettyDuration(
            endTime - startTime
        )})`,
        "color: blue",
        "color: white",
        "color: gray"
    );
}

function getSessionToken() {
    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }
    return sessionToken;
}

export async function initializePuzzle(year: string, day: string, dir: string) {
    const puzzleUrl = `https://adventofcode.com/20${year}/day/${day}`;
    const puzzlePath = path.join(dir, "README.md");

    console.log(
        `Fetching puzzle from %c${puzzleUrl}%c into %c${puzzlePath}`,
        "color: gray",
        "color: white",
        "color: gray"
    );
    const res = await fetch(puzzleUrl, {
        headers: { cookie: `session=${getSessionToken()}` },
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

    await Deno.writeTextFile(puzzlePath, markdown);
}

async function initializeInput(year: string, day: string, dir: string) {
    const inputUrl = `https://adventofcode.com/20${year}/day/${day}/input`;
    const inputPath = path.join(dir, "input.txt");

    if (await fileExists(inputPath)) {
        console.log(
            `Input already exists at %c${inputPath}%c - skipping...`,
            "color: gray",
            "color: white"
        );
        return;
    }

    console.log(
        `Fetching input from %c${inputUrl}%c into %c${inputPath}`,
        "color: gray",
        "color: white",
        "color: gray"
    );
    const res = await fetch(inputUrl, {
        headers: { cookie: `session=${getSessionToken()}` },
    });
    if (!res.ok) {
        throw new Error(
            `Failed to fetch input: ${res.status} (${res.statusText})`
        );
    }
    const input = await res.text();
    await Deno.writeTextFile(inputPath, input);
}

async function initializeSolver(year: string, day: string, dir: string) {
    const id = `${year}D${day}`;
    const solverPath = path.join(dir, "solver.ts");

    if (await fileExists(solverPath)) {
        console.log(
            `Solver already exists at %c${solverPath}%c - skipping...`,
            "color: gray",
            "color: white"
        );
        return;
    }

    console.log(`Generating solver into %c${solverPath}`, "color: gray");
    const solverClass = generateSolverClass(id);
    await Deno.writeTextFile(solverPath, solverClass);
}

async function initializeSolverFactory() {
    const existingSolvers = await getExistingSolverIds();
    const solverFactoryPath = path.join("lib", "solver-factory.ts");

    console.log(
        `Generating solver factory into %c${solverFactoryPath}`,
        "color: gray"
    );
    const solverFactoryClass = generateSolverFactoryClass(existingSolvers);
    await Deno.writeTextFile(solverFactoryPath, solverFactoryClass);
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
