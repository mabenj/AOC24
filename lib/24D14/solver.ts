import { PuzzleSolver } from "../types/puzzle-solver.ts";
import { Jimp } from "npm:jimp";

const ROBOT_REGEX = /p=(-*[0-9]+),(-*[0-9]+) v=(-*[0-9]+),(-*[0-9]+)/;
const MAX_X = 101;
const MAX_Y = 103;
const VARIANCE_THRESHOLD = 300_000;

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
        for (let tick = 0; tick < 100; tick++) {
            this.robots = this.robots.map((robot) => this.moveRobot(robot));
        }
        return this.calculateSafetyFactor();
    }

    async solvePart2() {
        let varianceX = Number.MAX_VALUE;
        let varianceY = Number.MAX_VALUE;
        let tick = 0;
        while (
            varianceX > VARIANCE_THRESHOLD ||
            varianceY > VARIANCE_THRESHOLD
        ) {
            this.robots = this.robots.map((robot) => this.moveRobot(robot));
            tick++;
            [varianceX, varianceY] = this.calculateRobotVariance();
        }
        await this.renderGrid(tick);
        return tick;
    }

    private moveRobot(robot: Robot) {
        let nextX = robot.pos.x + robot.velocity.x;
        let nextY = robot.pos.y + robot.velocity.y;
        if (nextX < 0) {
            const overflow = Math.abs(nextX);
            nextX = MAX_X - overflow;
        } else if (nextX >= MAX_X) {
            const overflow = nextX - MAX_X;
            nextX = 0 + overflow;
        }
        if (nextY < 0) {
            const overflow = Math.abs(nextY);
            nextY = MAX_Y - overflow;
        } else if (nextY >= MAX_Y) {
            const overflow = nextY - MAX_Y;
            nextY = 0 + overflow;
        }
        robot.pos = { x: nextX, y: nextY };
        return robot;
    }

    private calculateSafetyFactor() {
        const middleX = Math.floor(MAX_X / 2);
        const middleY = Math.floor(MAX_Y / 2);
        const quadrantCounts = [0, 0, 0, 0];
        for (const robot of this.robots) {
            const { x, y } = robot.pos;
            if (x < middleX && y < middleY) quadrantCounts[0]++;
            if (x > middleX && y < middleY) quadrantCounts[1]++;
            if (x < middleX && y > middleY) quadrantCounts[2]++;
            if (x > middleX && y > middleY) quadrantCounts[3]++;
        }
        return quadrantCounts.reduce((acc, curr) => {
            return acc * curr;
        }, 1);
    }

    private calculateRobotVariance() {
        const xCoords = this.robots.map((robot) => robot.pos.x);
        const yCoords = this.robots.map((robot) => robot.pos.y);
        return [getVariance(...xCoords), getVariance(...yCoords)];
    }

    private async renderGrid(tick: number) {
        const image = new Jimp({
            width: MAX_X,
            height: MAX_Y,
            color: 0x000000ff,
        });
        for (const robot of this.robots) {
            const { x, y } = robot.pos;
            image.setPixelColor(0xffffffff, x, y);
        }
        image.resize({ w: 1000 });
        await Deno.mkdir("lib/24D14/renders", { recursive: true });
        await image.write(`lib/24D14/renders/tick-${tick}.png`);
    }
}

function getVariance(...values: number[]) {
    const mean = values.reduce((acc, curr) => acc + curr, 0) / values.length;
    return values.reduce((acc, curr) => acc + (curr - mean) ** 2, 0);
}
