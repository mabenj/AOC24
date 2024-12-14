import path from "node:path";
import { PuzzleSolver } from "../types/puzzle-solver.ts";
import { Jimp } from "npm:jimp";

const ROBOT_REGEX = /p=(-*[0-9]+),(-*[0-9]+) v=(-*[0-9]+),(-*[0-9]+)/;
const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;
const VARIANCE_THRESHOLD = 250_000;

type Robot = {
    pos: { x: number; y: number };
    velocity: { x: number; y: number };
};

export default class Solver24D14 implements PuzzleSolver {
    private robots: Robot[] = [];

    parseInput(input: string[]) {
        this.robots = input
            .filter((line) => !!line)
            .map((line) => {
                const [_, px, py, vx, vy] = line.match(ROBOT_REGEX)!;
                return {
                    pos: { x: +px, y: +py },
                    velocity: { x: +vx, y: +vy },
                };
            });
    }

    solvePart1() {
        return calculateSafetyFactor(
            this.robots.map((robot) => moveRobot(robot, 100))
        );
    }

    async solvePart2() {
        let tick = 0;
        let variance = Number.MAX_VALUE;
        while (variance > VARIANCE_THRESHOLD) {
            tick++;
            this.robots = this.robots.map((robot) => moveRobot(robot, 1));
            variance = calculateRobotVariance(this.robots);
        }
        await renderGrid(this.robots, tick);
        return tick;
    }
}

function moveRobot(robot: Robot, times: number) {
    const remainderX = (robot.pos.x + robot.velocity.x * times) % GRID_WIDTH;
    const remainderY = (robot.pos.y + robot.velocity.y * times) % GRID_HEIGHT;
    robot.pos = {
        x: remainderX < 0 ? remainderX + GRID_WIDTH : remainderX,
        y: remainderY < 0 ? remainderY + GRID_HEIGHT : remainderY,
    };
    return robot;
}

function calculateSafetyFactor(robots: Robot[]) {
    const middleX = Math.floor(GRID_WIDTH / 2);
    const middleY = Math.floor(GRID_HEIGHT / 2);
    const quadrantCounts = [0, 0, 0, 0];
    for (const robot of robots) {
        const { x, y } = robot.pos;
        if (x < middleX && y < middleY) quadrantCounts[0]++;
        else if (x > middleX && y < middleY) quadrantCounts[1]++;
        else if (x < middleX && y > middleY) quadrantCounts[2]++;
        else if (x > middleX && y > middleY) quadrantCounts[3]++;
    }
    return quadrantCounts.reduce((acc, curr) => acc * curr, 1);
}

function calculateRobotVariance(robots: Robot[]) {
    const varianceX = getVariance(robots.map((robot) => robot.pos.x));
    const varianceY = getVariance(robots.map((robot) => robot.pos.y));
    return (varianceX + varianceY) / 2;
}

function getVariance(values: number[]) {
    const mean = values.reduce((acc, curr) => acc + curr, 0) / values.length;
    return values.reduce((acc, curr) => acc + (curr - mean) ** 2, 0);
}

async function renderGrid(robots: Robot[], tick: number) {
    const image = new Jimp({
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        color: 0x000000ff,
    });
    for (const { pos } of robots) {
        image.setPixelColor(0xffffffff, pos.x, pos.y);
    }
    const renderPath = path.join("lib", "24D14", "renders", `tick-${tick}.png`);
    console.log(`Rendering tick ${tick} into %c${renderPath}`, "color: gray");
    await Deno.mkdir(path.dirname(renderPath), { recursive: true });
    // deno-lint-ignore no-explicit-any
    await image.write(renderPath as any);
}
