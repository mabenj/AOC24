import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { NodeHtmlMarkdown } from "npm:node-html-markdown";

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function prettyNumber(number: number | undefined) {
    if (typeof number === "undefined") {
        return "";
    }
    return NUMBER_FORMATTER.format(number);
}

export const LINE_SEPARATOR = "\r\n";

export async function fetchPuzzle(year: string, day: string) {
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

export async function fetchInput(year: string, day: string) {
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
