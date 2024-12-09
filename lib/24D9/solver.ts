import { toDictionary } from "../common.ts";
import { PuzzleSolver } from "../types/puzzle-solver.ts";

type File = {
    id: number;
    length: number;
    freespace: number;
};

export default class Solver24D9 implements PuzzleSolver {
    private disk: File[] = [];

    parseInput(input: string[]) {
        const digits = input[0].split("").map(Number);
        let id = 0;
        for (let i = 0; i < digits.length; i += 2) {
            const length = digits[i];
            const freespace = digits[i + 1] ?? 0;
            this.disk.push({ id, length, freespace });
            id++;
        }
    }

    solvePart1() {
        const compacted = compress(this.disk);
        return calculateChecksum(compacted);
    }

    solvePart2() {
        const defragmented = defrag(this.disk);
        return calculateChecksum(defragmented);
    }
}

function compress(disk: File[]): number[] {
    const blocks = filesToBlocks(disk);
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] !== -1) {
            continue;
        }
        blocks[i] = getBlockFromEnd(i);
    }
    return blocks;

    function getBlockFromEnd(minIndex: number) {
        for (let i = blocks.length - 1; i > minIndex; i--) {
            const block = blocks[i];
            if (block === -1) {
                continue;
            }
            blocks[i] = -1;
            return block;
        }
        return -1;
    }
}

function defrag(disk: File[]): number[] {
    const filesById = toDictionary(disk, "id");
    const blocks = filesToBlocks(disk);
    let i = blocks.length - 1;
    while (i >= 0) {
        if (blocks[i] === -1) {
            i--;
            continue;
        }
        const file = filesById[blocks[i]];
        const freespaceStart = findFreespace(i, file.length);
        if (freespaceStart !== -1) {
            for (let j = 0; j < file.length; j++) {
                blocks[freespaceStart + j] = file.id;
                blocks[i - j] = -1;
            }
        }
        i -= file.length;
    }
    return blocks;

    function findFreespace(maxIndex: number, length: number) {
        for (let i = 0; i < maxIndex; i++) {
            if (blocks[i] !== -1) {
                continue;
            }
            for (let j = 0; j < length; j++) {
                if (blocks[i + j] !== -1) {
                    i += j;
                    break;
                }
                if (j === length - 1) {
                    return i;
                }
            }
        }
        return -1;
    }
}

function calculateChecksum(blocks: number[]) {
    let result = 0;
    for (let i = 0; i < blocks.length; i++) {
        const id = blocks[i];
        if (id === -1) {
            continue;
        }
        result += i * id;
    }
    return result;
}

function createArray(length: number, value: number): number[] {
    return Array.from<number>({ length }).fill(value);
}

function filesToBlocks(files: File[]): number[] {
    return files.flatMap((file) => {
        const { id, length, freespace } = file;
        return [...createArray(length, id), ...createArray(freespace, -1)];
    });
}
