import { PuzzleSolver } from "../types/puzzle-solver.ts";

type CategoryMap = {
    label: string;
    prevMap: CategoryMap | null;
    nextMap: CategoryMap | null;
    ranges: {
        prevMapStart: number;
        nextMapStart: number;
        length: number;
    }[];
};

export default class Solver23D5 implements PuzzleSolver {
    private seeds: number[] = [];
    private seedRanges: { start: number; end: number }[] = [];
    private maps: CategoryMap[] = [];

    parseInput(input: string[]) {
        this.seeds = input[0]
            .split(" ")
            .filter((n) => n.match(/\d+/))
            .map(Number);
        this.seedRanges = convertToRanges(this.seeds);
        this.maps = parseMaps(input);
    }

    solvePart1() {
        const locationNumbers = this.seeds
            .map((seed) => this.translateValue(seed, this.maps[0]))
            .sort((a, b) => a - b);
        return locationNumbers[0];
    }

    solvePart2() {
        const lastMap = this.maps[this.maps.length - 1];
        let ranges = lastMap.ranges
            .map((range) => ({
                start: range.nextMapStart,
                end: range.nextMapStart + range.length,
            }))
            .sort((a, b) => a.start - b.start);
        if (ranges[0].start !== 0) {
            // fill the gap between zero and the first range
            ranges = [{ start: 0, end: ranges[0].start }, ...ranges];
        }
        for (const range of ranges) {
            for (
                let locationNumber = range.start;
                locationNumber < range.end;
                locationNumber++
            ) {
                const seed = this.translateValue(locationNumber, lastMap, true);
                const seedRange = this.seedRanges.find(
                    (seedRange) =>
                        seedRange.start <= seed && seedRange.end >= seed
                )!;
                if (seedRange) {
                    return locationNumber;
                }
            }
        }
        throw new Error("No solution found");
    }

    private translateValue(
        value: number,
        startingMap: CategoryMap,
        backwards = false
    ): number {
        const upcomingMap = backwards
            ? startingMap.prevMap
            : startingMap.nextMap;
        if (upcomingMap === null && !backwards) {
            return value;
        }
        const range = startingMap.ranges.find((range) => {
            const rangeStart = backwards
                ? range.nextMapStart
                : range.prevMapStart;
            return rangeStart <= value && rangeStart + range.length > value;
        });
        let offset = 0;
        if (range) {
            offset = backwards
                ? range.prevMapStart - range.nextMapStart
                : range.nextMapStart - range.prevMapStart;
        }
        const mappedValue = value + offset;
        if (upcomingMap === null) {
            return mappedValue;
        }
        return this.translateValue(mappedValue, upcomingMap, backwards);
    }
}

function convertToRanges(values: number[]) {
    const result = [] as { start: number; end: number }[];
    for (let i = 1; i < values.length; i += 2) {
        const start = values[i - 1];
        const end = start + values[i];
        result.push({ start, end });
    }
    return result;
}

function parseMaps(lines: string[]): CategoryMap[] {
    const result = [] as CategoryMap[];
    let currentMap: CategoryMap = {
        label: "",
        prevMap: null,
        nextMap: null,
        ranges: [],
    };
    for (let i = 2; i < lines.length; i++) {
        if (lines[i] === "") {
            // Map ended
            const newMap = {
                label: "",
                prevMap: currentMap,
                nextMap: null,
                ranges: [],
            };
            currentMap.nextMap = newMap;
            result.push(currentMap);
            currentMap = newMap;
            continue;
        }

        const headerMatch = lines[i].match(/(?<from>.+)-to-(?<to>.+) map:/);
        if (headerMatch) {
            const { from, to } = headerMatch.groups!;
            currentMap.label = `${from}-to-${to}`;
            i++;
        }

        const [nextMapStart, prevMapStart, length] = lines[i]
            .split(" ")
            .map(Number);
        currentMap.ranges.push({ prevMapStart, nextMapStart, length });

        if (i === lines.length - 1) {
            result.push(currentMap);
        }
    }
    return result;
}
