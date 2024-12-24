import { PuzzleSolver } from "../types/puzzle-solver.ts";

const EXAMPLE = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`;

export default class Solver24D23 implements PuzzleSolver {
    private adjacencyList = new Map<string, string[]>();

    parseInput(input: string[]) {
        // input = EXAMPLE.trim().split("\n");
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

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}
