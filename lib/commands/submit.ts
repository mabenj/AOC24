import { DOMParser } from "jsr:@b-fuze/deno-dom";

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
    } else if (result.startsWith("that's not the right answer")) {
        console.log(`Answer is incorrect! %c(${answer})`, "color: red");
    } else if (result.startsWith("you gave an answer too recently")) {
        console.log(
            `You gave an answer too recently! %c(${answer})`,
            "color: yellow"
        );
    } else {
        throw new Error("Unexpected response when submitting answer");
    }
}
