import { PuzzleSolver } from "../types/puzzle-solver.ts";

const DIRECTIONS = [
    [0, -1], // North
    [1, 0], // East
    [0, 1], // South
    [-1, 0], // West
];

const EXAMPLE = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`;

type TrackNode = {
    x: number;
    y: number;
    id: string;
};
type Shortcut = {
    start: TrackNode;
    end: TrackNode;
    size: number;
};

export default class Solver24D20 implements PuzzleSolver {
    private grid: string[][] = [];

    parseInput(input: string[]) {
        // input = EXAMPLE.split("\n");
        this.grid = input
            .filter((line) => !!line)
            .map((line) => line.split(""));
    }

    solvePart1() {
        const track = discoverTrack(this.grid);
        const shortcuts = findShortcuts(this.grid, track);
        return shortcuts.filter(({ size }) => size >= 100).length;
    }

    solvePart2(): number | string {
        throw new Error("Method not implemented.");
    }
}

function discoverTrack(grid: string[][]): TrackNode[] {
    let currentY = grid.findIndex((row) => row.includes("S"));
    let currentX = grid[currentY].indexOf("S");
    let prevX = -1;
    let prevY = -1;

    const canMoveTo = (x: number, y: number) =>
        grid[y][x] !== "#" && (x !== prevX || y !== prevY);

    const track: TrackNode[] = [];
    while (prevX !== currentX || prevY !== currentY) {
        track.push({ x: currentX, y: currentY, id: `${currentX},${currentY}` });
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
    return track;
}

function findShortcuts(grid: string[][], track: TrackNode[]) {
    const distanceCache = new Map<string, number>();

    const distanceToEnd = (nodeId: string) => {
        if (distanceCache.has(nodeId)) return distanceCache.get(nodeId)!;
        const idx = track.findIndex(({ id }) => id === nodeId);
        const distance = track.length - 1 - idx;
        distanceCache.set(nodeId, distance);
        return distance;
    };

    const getShortcuts = (node: TrackNode): Shortcut[] => {
        const currentDistance = distanceToEnd(node.id);

        const getShortcut = (x: number, y: number) => {
            if (grid[y]?.[x] !== "." && grid[y]?.[x] !== "E") return null;
            const id = `${x},${y}`;
            const size = currentDistance - 2 - distanceToEnd(id);
            if (size <= 0) return null;
            return { start: node, end: { x, y, id }, size };
        };

        const shortcuts: { [endId: string]: Shortcut } = {};
        for (const [dx, dy] of DIRECTIONS) {
            const wallX = node.x + dx;
            const wallY = node.y + dy;
            const isValidWall = grid[wallY][wallX] === "#";
            if (!isValidWall) continue;

            const potentialShortcuts = [
                getShortcut(wallX, wallY - 1),
                getShortcut(wallX + 1, wallY),
                getShortcut(wallX, wallY + 1),
                getShortcut(wallX - 1, wallY),
            ].filter((shortcut) => shortcut != null);
            const best = potentialShortcuts.reduce((prev, curr) => {
                return prev?.size > curr?.size ? prev : curr;
            }, potentialShortcuts[0]);

            if (best) shortcuts[best.end.id] = best;
        }
        return Object.values(shortcuts);
    };

    const result: Shortcut[] = [];
    for (const node of track) {
        result.push(...getShortcuts(node));
    }

    return result;
}
