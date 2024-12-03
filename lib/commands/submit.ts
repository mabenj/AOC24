import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { fetchPuzzle } from "../common.ts";
import * as path from "jsr:@std/path";

export default async function submit(
    answer: string | number,
    year: string,
    day: string,
    part: string
) {
    const sessionToken = Deno.env.get("AOC_SESSION");
    if (!sessionToken) {
        throw new Error("Missing 'AOC_SESSION' environment variable");
    }
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
        if (part === "1") {
            await updatePuzzle(year, day);
        }
    } else if (result.startsWith("that's not the right answer")) {
        if (result.includes("answer is too low")) {
            console.log(`Answer is too low! %c(${answer})`, "color: red");
        } else if (result.includes("answer is too high")) {
            console.log(`Answer is too high! %c(${answer})`, "color: red");
        } else {
            console.log(`Answer is incorrect! %c(${answer})`, "color: red");
        }
    } else if (result.startsWith("you gave an answer too recently")) {
        console.log(
            `You gave an answer too recently! %c(${answer})`,
            "color: yellow"
        );
    } else if (
        result.startsWith("you don't seem to be solving the right level")
    ) {
        console.log(
            "You don't seem to be solving the right level. Did you already complete it?"
        );
        if (part === "1") {
            await updatePuzzle(year, day);
        }
    } else {
        throw new Error("Unexpected response when submitting answer");
    }
}

async function updatePuzzle(year: string, day: string) {
    console.log(`Updating puzzle`);
    const puzzle = await fetchPuzzle(year, day);
    const dir = path.join("lib", `${year}D${day}`);
    const puzzlePath = path.join(dir, "README.md");
    console.log(`Writing puzzle to %c${puzzlePath}`, "color: gray");
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(puzzlePath, puzzle);
    console.log(`Puzzle updated!`);
}
