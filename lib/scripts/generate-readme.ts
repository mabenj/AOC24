import path from "node:path";
import { fileExists, groupBy, prettyDuration } from "../common.ts";
import { BenchmarkInfo } from "../types/benchmark-info.ts";

type PuzzleData = {
    year: string;
    day: string;
    part: string;
    benchmark?: BenchmarkInfo;
};

async function main() {
    const libDirs = Array.from(Deno.readDirSync("lib")).filter(
        (entry) => entry.isDirectory
    );
    const puzzles: PuzzleData[] = [];
    for (const dir of libDirs) {
        const match = dir.name.match(/^(?<year>[0-9]{2})D(?<day>[0-9]{1,2})$/);
        if (!match?.groups) continue;
        const { year, day } = match.groups;
        puzzles.push(await getPuzzleData(year, day, "1"));
        puzzles.push(await getPuzzleData(year, day, "2"));
    }

    const content = await generateReadme(puzzles);

    await Deno.writeTextFile("README.md", content);
}

if (import.meta.main) {
    await main();
}

async function getPuzzleData(year: string, day: string, part: string) {
    const benchmarkPath = path.join(
        "lib",
        `${year}D${day}`,
        `benchmark-part-${part}.json`
    );
    const benchmarkExists = await fileExists(benchmarkPath);
    const benchmark = benchmarkExists
        ? (JSON.parse(
              await Deno.readTextFile(benchmarkPath)
          ) as PuzzleData["benchmark"])
        : undefined;
    return { year, day, part, benchmark };
}

async function generateReadme(puzzles: PuzzleData[]) {
    const prevReadme = await Deno.readTextFile("README.md");
    const readmeLines = prevReadme.split("\n");
    const startIndex =
        readmeLines.findIndex((line) => line.startsWith("## Solutions")) + 1;
    const endIndex = readmeLines.findIndex((line) =>
        line.startsWith("## Prerequisites")
    );

    const hardwareConfigs = [
        ...new Set(
            puzzles
                .map(({ benchmark }) => generateHwString(benchmark))
                .filter((str) => !!str)
        ),
    ];

    readmeLines.splice(
        startIndex,
        endIndex - startIndex,
        ...generateBenchmarksTable()
    );

    return readmeLines.join("\n");

    function generateBenchmarksTable() {
        const result = [] as string[];
        result.push("");
        for (let i = 0; i < hardwareConfigs.length; i++) {
            const hwConfig = hardwareConfigs[i];
            result.push(`${i + 1}. *${hwConfig}*`);
        }
        result.push("");

        const puzzlesByYear = groupBy(puzzles, "year");
        const years = Object.keys(puzzlesByYear)
            .map(Number)
            .sort((a, b) => b - a);
        for (const year of years) {
            result.push(`| 20${year} | Part 1 | Part 2 |`);
            result.push(`| --- | --- | --- |`);
            const puzzlesByDay = groupBy(puzzlesByYear[year], "day");
            const days = Object.keys(puzzlesByDay)
                .map(Number)
                .sort((a, b) => a - b);
            for (const day of days) {
                const part1 = puzzlesByDay[day].find(
                    (puzzle) => puzzle.part === "1"
                );
                const part2 = puzzlesByDay[day].find(
                    (puzzle) => puzzle.part === "2"
                );
                const part1Hw = generateHwString(part1?.benchmark);
                const part2Hw = generateHwString(part2?.benchmark);
                const part1HwRef = hardwareConfigs.indexOf(part1Hw ?? "") + 1;
                const part2HwRef = hardwareConfigs.indexOf(part2Hw ?? "") + 1;
                const part1Duration = part1?.benchmark?.duration
                    ? prettyDuration(part1.benchmark.duration)
                    : "N/A";
                const part2Duration = part2?.benchmark?.duration
                    ? prettyDuration(part2.benchmark.duration)
                    : "N/A";
                result.push(
                    `| [Day ${day}](/lib/${year}D${day}/solver.ts) | ${part1Duration} <sup>${part1HwRef}</sup> | ${part2Duration} <sup>${part2HwRef}</sup> |`
                );
            }
            result.push("");
        }

        result.push(
            `> Generated at ${new Date().toUTCString()} [![Generate README](https://github.com/mabenj/aoc-deno-ts/actions/workflows/generate-readme.yml/badge.svg)](https://github.com/mabenj/aoc-deno-ts/actions/workflows/generate-readme.yml)`
        );
        result.push("");

        return result;
    }

    function generateHwString(benchmarkInfo?: BenchmarkInfo) {
        if (!benchmarkInfo) return null;
        const { deno, os, arch, memory, cpu } = benchmarkInfo;
        return `deno ${deno}, ${os} ${arch}, ${memory}, ${cpu}`;
    }
}
