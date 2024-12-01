import { PuzzleSolver } from "../types/puzzle-solver";

export class Day1Part2 implements PuzzleSolver {
  solve(input: string): string {
    const [list1, list2] = input.split("\n").reduce(
      (acc, line) => {
        const [num1, num2] = line.split("   ");
        if (num1 && num2) {
          acc[0].push(parseInt(num1.trim()));
          acc[1].push(parseInt(num2.trim()));
        }
        return acc;
      },
      [[], []] as [number[], number[]]
    );

    const occurrenceMap = list2.reduce((acc, num) => {
      acc.set(num, (acc.get(num) ?? 0) + 1);
      return acc;
    }, new Map<number, number>());

    const similarityScore = list1.reduce((acc, num) => {
      const multiplier = occurrenceMap.get(num) ?? 0;
      return acc + num * multiplier;
    }, 0);

    return similarityScore.toString();
  }
}
