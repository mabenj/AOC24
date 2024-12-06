import { LINE_SEPARATOR } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

type Category =
    | "seed"
    | "soil"
    | "fertilizer"
    | "water"
    | "light"
    | "temperature"
    | "humidity"
    | "location";

type CategoryMap = {
    source: Category;
    destination: Category;
    ranges: {
        sourceStart: number;
        sourceEnd: number;
        offset: number;
    }[];
};

export default class Solver23D5 implements PuzzleSolver {
    private seeds: number[] = [];
    private maps: CategoryMap[] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split(LINE_SEPARATOR);
        this.seeds = input[0]
            .split(" ")
            .filter((n) => n.match(/\d+/))
            .map(Number);

        let currentMap: CategoryMap = {
            source: "seed",
            destination: "soil",
            ranges: [],
        };
        for (let i = 2; i < input.length; i++) {
            if (input[i] === "" || i === input.length - 1) {
                // Category ended
                this.maps.push(currentMap);
                currentMap = {
                    source: "seed",
                    destination: "soil",
                    ranges: [],
                };
                continue;
            }

            const headerMatch = input[i].match(
                /(?<source>.+)-to-(?<destination>.+) map:/
            );
            if (headerMatch) {
                currentMap.source = headerMatch.groups!.source as Category;
                currentMap.destination = headerMatch.groups!
                    .destination as Category;
                i++;
            }

            const [destinationStart, sourceStart, length] = input[i]
                .split(" ")
                .map(Number);
            currentMap.ranges.push({
                sourceStart,
                sourceEnd: sourceStart + length,
                offset: destinationStart - sourceStart,
            });
        }
    }

    solvePart1() {
        const locationNumbers = this.seeds
            .map((seed) => this.getDestination("seed", "location", seed))
            .sort((a, b) => a - b);
        return locationNumbers[0];
    }

    solvePart2(): string | number {
        throw new Error("Method not implemented.");
    }

    private getDestination(
        source: Category,
        destination: Category,
        value: number
    ): number {
        if (source === destination) {
            return value;
        }
        const currentMap = this.maps.find((map) => map.source === source)!;
        const range = currentMap.ranges.find(
            (range) => range.sourceStart <= value && range.sourceEnd >= value
        );
        const mappedValue = value + (range?.offset ?? 0);
        return this.getDestination(
            currentMap.destination,
            destination,
            mappedValue
        );
    }
}
