import { PuzzleSolver } from "../types/puzzle-solver.ts";

type Node = {
    id: string;
    x: number;
    y: number;
};

type Shortcut = {
    start: Node;
    end: Node;
    savedTime: number;
};

export default class Solver24D20 implements PuzzleSolver {
    private track: Node[] = [];

    parseInput(input: string[]) {
        const grid = input
            .filter((line) => !!line)
            .map((line) => line.split(""));

        let currentY = grid.findIndex((row) => row.includes("S"));
        let currentX = grid[currentY].indexOf("S");
        let prevX = -1;
        let prevY = -1;

        const canMoveTo = (x: number, y: number) =>
            grid[y][x] !== "#" && (x !== prevX || y !== prevY);

        while (prevX !== currentX || prevY !== currentY) {
            this.track.push({
                x: currentX,
                y: currentY,
                id: `${currentX},${currentY}`,
            });
            if (grid[currentY][currentX] === "E") break;
            const canGoNorth = canMoveTo(currentX, currentY - 1);
            const canGoEast = canMoveTo(currentX + 1, currentY);
            const canGoSouth = canMoveTo(currentX, currentY + 1);
            const canGoWest = canMoveTo(currentX - 1, currentY);
            prevX = currentX;
            prevY = currentY;
            if (canGoNorth) currentY--;
            if (canGoEast) currentX++;
            if (canGoSouth) currentY++;
            if (canGoWest) currentX--;
        }
    }

    solvePart1() {
        const shortcuts = getShortcuts(this.track, 2);
        return shortcuts.filter(({ savedTime }) => savedTime >= 100).length;
    }

    solvePart2() {
        const shortcuts = getShortcuts(this.track, 20);
        return shortcuts.filter(({ savedTime }) => savedTime >= 100).length;
    }
}

function getShortcuts(track: Node[], shortCutDuration: number) {
    // Manhattan distance
    const distanceBetween = (a: Node, b: Node) =>
        Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    const shortcuts: Shortcut[] = [];
    for (let i = 0; i < track.length; i++) {
        const startNode = track[i];
        const fullDistance = track.length - i;
        for (let j = i + 1; j < track.length; j++) {
            const endNode = track[j];
            const delta = distanceBetween(startNode, endNode);
            if (delta > shortCutDuration) continue;
            const shortcutDistance = delta + track.length - j;
            shortcuts.push({
                start: startNode,
                end: endNode,
                savedTime: fullDistance - shortcutDistance,
            });
        }
    }
    return shortcuts;
}
