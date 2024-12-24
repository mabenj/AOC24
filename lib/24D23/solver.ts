import { PuzzleSolver } from "../types/puzzle-solver.ts";

export default class Solver24D23 implements PuzzleSolver {
    private adjacencyList = new Map<string, string[]>();

    parseInput(input: string[]) {
        for (const line of input.filter((line) => !!line)) {
            const [a, b] = line.split("-");
            if (!this.adjacencyList.has(a)) {
                this.adjacencyList.set(a, []);
            }
            if (!this.adjacencyList.has(b)) {
                this.adjacencyList.set(b, []);
            }
            this.adjacencyList.get(a)!.push(b);
            this.adjacencyList.get(b)!.push(a);
        }
    }

    solvePart1() {
        const groupsOf3 = new Set<string>();
        for (const [computer, neighbors] of this.adjacencyList.entries()) {
            if (!computer.startsWith("t")) {
                continue;
            }
            for (const neighbor of neighbors) {
                for (const neighbor2 of this.adjacencyList.get(neighbor)!) {
                    if (neighbor2 === computer || neighbor2 === neighbor) {
                        continue;
                    }
                    for (const neighbor3 of this.adjacencyList.get(
                        neighbor2
                    )!) {
                        if (neighbor3 !== computer) {
                            continue;
                        }
                        const group = [computer, neighbor, neighbor2]
                            .sort()
                            .join(",");
                        groupsOf3.add(group);
                    }
                }
            }
        }

        return groupsOf3.size;
    }

    solvePart2() {
        let biggestGroup = new Array<string>();
        for (const computer of this.adjacencyList.keys()) {
            const group = this.getInterconnected(computer);
            if (group.length > biggestGroup.length) biggestGroup = group;
        }

        return biggestGroup.sort().join(",");
    }

    private getInterconnected(computer: string) {
        const neighbors = this.adjacencyList.get(computer)!;
        let group = new Set([computer, ...neighbors]);
        for (const neighbor of neighbors) {
            if (!group.has(neighbor)) {
                continue;
            }
            const neighborsOfNeighbor = this.adjacencyList.get(neighbor)!;
            group = group.intersection(
                new Set([neighbor, ...neighborsOfNeighbor])
            );
        }
        return [...group];
    }
}
