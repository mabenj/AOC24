import { PuzzleSolver } from "../types/puzzle-solver";

export class Day2Part1 implements PuzzleSolver {
    solve(input: string): string {
        const reports = input
            .split("\r\n")
            .filter((line) => !!line)
            .map((line) => line.split(" ").map((num) => +num));
        const safeReports = reports.filter(isSafeReport);
        return safeReports.length.toString();
    }
}

function isSafeReport(report: number[]): boolean {
    const DELTA_UPPER = 3;
    const DELTA_LOWER = 1;

    const shouldBeIncreasing = report[1] > report[0];
    for (let i = 1; i < report.length; i++) {
        const current = report[i];
        const prev = report[i - 1];
        const delta = Math.abs(current - prev);
        const isIncreasing = current > prev;
        if (
            delta < DELTA_LOWER ||
            delta > DELTA_UPPER ||
            shouldBeIncreasing !== isIncreasing
        ) {
            return false;
        }
    }

    return true;
}
