import { LINE_SEPARATOR, prettyDuration } from "../common.ts";
import SolverFactory from "../solver-factory.ts";
import * as path from "jsr:@std/path";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { initializePuzzle } from "./init.ts";

export default async function solve(year: string, day: string, part: string) {
    const puzzleId = `${year}D${day}`;
    const puzzleDir = path.join("lib", puzzleId);
    try {
        const solver = SolverFactory.getSolver(puzzleId);
        const solveMethod =
            part === "1"
                ? () => solver.solvePart1()
                : () => solver.solvePart2();

        const input = await Deno.readTextFile(
            path.join(puzzleDir, "input.txt")
        );
        if (!input) {
            throw new Error(`No input found for ${puzzleId}`);
        }

        const startTime = performance.now();
        solver.parseInput(input.split(LINE_SEPARATOR));
        const output = solveMethod();
        const endTime = performance.now();

        console.log(
            `Solved ${puzzleId} part ${part}: %c${output} %c(${prettyDuration(
                endTime - startTime
            )})`,
            "color: green",
            "color: gray"
        );

        if (confirm("Do you want to submit this answer?")) {
            const isCorrect = await submitAnswer(output, year, day, part);
            if (
                isCorrect &&
                part === "1" &&
                confirm("Do you want to fetch part 2?")
            ) {
                await initializePuzzle(year, day, puzzleDir, "2");
            }
        }
    } catch (e) {
        console.error(
            `%cError while solving ${puzzleId} part ${part}`,
            "color: red"
        );
        throw e;
    }
}

async function submitAnswer(
    answer: string | number,
    year: string,
    day: string,
    part: string
) {
    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }
    console.log("Submitting answer...");
    const res = await fetch(
        `https://adventofcode.com/20${year}/day/${day}/answer`,
        {
            method: "POST",
            headers: {
                cookie: `session=${sessionToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                level: part,
                answer: answer.toString(),
            }),
        }
    );
    if (!res.ok) {
        throw new Error(
            `Failed submit answer: ${res.status} (${res.statusText})`
        );
    }
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const result =
        doc.querySelector("p")?.textContent?.trim().toLowerCase() || "";
    if (result.startsWith("that's the right answer")) {
        console.log(`Answer is correct! %c(${answer})`, "color: green");
        return true;
    } else if (result.startsWith("that's not the right answer")) {
        if (result.includes("answer is too low")) {
            console.log(`Answer is too low! %c(${answer})`, "color: red");
        } else if (result.includes("answer is too high")) {
            console.log(`Answer is too high! %c(${answer})`, "color: red");
        } else {
            console.log(`Answer is incorrect! %c(${answer})`, "color: red");
        }
        return false;
    } else if (result.startsWith("you gave an answer too recently")) {
        console.log(
            `You gave an answer too recently! %c(${answer})`,
            "color: yellow"
        );
        return false;
    } else if (
        result.startsWith("you don't seem to be solving the right level")
    ) {
        console.log(
            "You don't seem to be solving the right level. Did you already complete it?"
        );
        return false;
    } else {
        throw new Error("Unexpected response when submitting answer");
    }
}
