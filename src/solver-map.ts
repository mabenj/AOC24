import { Day1Part1 } from "./day1/part1";
import { Day1Part2 } from "./day1/part2";
import { PuzzleSolver } from "./puzzle-solver";

const SOLVERS: Record<string, PuzzleSolver> = {
  "1.1": new Day1Part1(),
  "1.2": new Day1Part2(),
};

export class SolverMap {
  private constructor() {}

  static getSolver(puzzleId: string): PuzzleSolver | null {
    return SOLVERS[puzzleId] ?? null;
  }
}
