import { PuzzleSolver } from "../puzzle-solver";

export class Day1Part1 implements PuzzleSolver {
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

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let sum = 0;
    for (let i = 0; i < list1.length; i++) {
      sum += Math.abs(list1[i] - list2[i]);
    }

    return sum.toString();
  }
}
