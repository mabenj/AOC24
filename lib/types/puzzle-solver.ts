export interface PuzzleSolver {
    parseInput(input: string[]): void;
    solvePart1(): string | number | Promise<string | number>;
    solvePart2(): string | number | Promise<string | number>;
}
