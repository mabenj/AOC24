import { PuzzleSolver } from "../types/puzzle-solver.ts";

type Coordinate = { x: number; y: number };

export default class Solver24D8 implements PuzzleSolver {
    private antennaCoordinates = new Map<string, Coordinate[]>();
    private gridBounds = { x: 0, y: 0 };

    parseInput(input: string[]) {
        input = input.filter((line) => !!line);
        for (let y = 0; y < input.length; y++) {
            for (let x = 0; x < input[y].length; x++) {
                const char = input[y][x];
                if (!isAntenna(char)) {
                    continue;
                }
                const prevCoords = this.antennaCoordinates.get(char) ?? [];
                this.antennaCoordinates.set(char, [...prevCoords, { x, y }]);
            }
        }
        this.gridBounds = { x: input[0].length, y: input.length };
    }

    solvePart1() {
        return this.getAllAntinodes(false).length;
    }

    solvePart2() {
        return this.getAllAntinodes(true).length;
    }

    private getAllAntinodes(ignoreDistance: boolean) {
        const uniqueAntinodeCoords = new Set<string>();
        for (const [_, coords] of this.antennaCoordinates) {
            this.getAntinodes(coords, ignoreDistance).forEach((antinode) =>
                uniqueAntinodeCoords.add(`${antinode.x},${antinode.y}`)
            );
        }
        return Array.from(uniqueAntinodeCoords).map((xy) => {
            const [x, y] = xy.split(",").map(Number);
            return { x, y };
        });
    }

    private getAntinodes(
        antennas: Coordinate[],
        ignoreDistance: boolean
    ): Coordinate[] {
        const antinodes = new Set<string>();
        for (let i = 0; i < antennas.length; i++) {
            for (let j = 0; j < antennas.length; j++) {
                if (i === j) {
                    continue;
                }
                let fixPointA = antennas[i];
                let fixPointB = antennas[j];
                if (ignoreDistance) {
                    antinodes.add(`${fixPointB.x},${fixPointB.y}`);
                }
                do {
                    const dx = fixPointB.x - fixPointA.x;
                    const dy = fixPointB.y - fixPointA.y;
                    const antinode = {
                        x: fixPointB.x + dx,
                        y: fixPointB.y + dy,
                    };
                    if (this.isPointInBounds(antinode)) {
                        antinodes.add(`${antinode.x},${antinode.y}`);
                    } else {
                        break;
                    }
                    fixPointA = fixPointB;
                    fixPointB = antinode;
                } while (ignoreDistance);
            }
        }
        return Array.from(antinodes).map((xy) => {
            const [x, y] = xy.split(",").map(Number);
            return { x, y };
        });
    }

    private isPointInBounds({ x, y }: Coordinate) {
        return (
            x >= 0 && x < this.gridBounds.x && y >= 0 && y < this.gridBounds.y
        );
    }
}

function isAntenna(char: string) {
    return char.match(/^[a-zA-Z0-9]$/);
}
