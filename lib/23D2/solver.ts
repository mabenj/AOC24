import { PuzzleSolver } from "../types/puzzle-solver.ts";

type CubeGame = {
    id: number;
    sets: CubeSet[];
};

type CubeSet = {
    red: number;
    green: number;
    blue: number;
};

export default class Solver23D2 implements PuzzleSolver {
    private games: CubeGame[] = [];

    parseInput(input: string[]) {
        this.games = input.filter((line) => !!line).map(parseGame);
    }

    solvePart1() {
        const sum = this.games.reduce((acc, game) => {
            if (isGamePossible(game)) {
                return acc + game.id;
            }
            return acc;
        }, 0);

        return sum;
    }

    solvePart2() {
        const sum = this.games.reduce(
            (acc, game) => acc + calculatePower(game),
            0
        );
        return sum;
    }
}

function parseGame(line: string): CubeGame {
    const [game, rawSets] = line.split(": ");
    const id = parseInt(game.split(" ")[1], 10);
    const sets = rawSets.split("; ").map((rawSet) => {
        const set = rawSet.split(", ").reduce(
            (acc, curr) => {
                const [count, color] = curr.split(" ");
                acc[color as keyof CubeSet] = parseInt(count, 10);
                return acc;
            },
            { red: 0, green: 0, blue: 0 } as CubeSet
        );
        return set;
    });

    return { id, sets };
}

function isGamePossible(game: CubeGame) {
    const RED_LIMIT = 12;
    const GREEN_LIMIT = 13;
    const BLUE_LIMIT = 14;
    return game.sets.every(
        ({ red, green, blue }) =>
            red <= RED_LIMIT && green <= GREEN_LIMIT && blue <= BLUE_LIMIT
    );
}

function calculatePower({ sets }: CubeGame): number {
    const maxRed = Math.max(...sets.map(({ red }) => red));
    const maxGreen = Math.max(...sets.map(({ green }) => green));
    const maxBlue = Math.max(...sets.map(({ blue }) => blue));
    return maxRed * maxGreen * maxBlue;
}
