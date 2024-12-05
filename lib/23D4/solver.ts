import { PuzzleSolver } from "../types/puzzle-solver.ts";

type ScratchCard = {
    id: number;
    winningNumbers: number[];
    numbers: number[];
};

export default class Solver23D4 implements PuzzleSolver {
    private cards: ScratchCard[] = [];
    private winCountCache = new Map<number, number>();

    parseInput(input: string[]) {
        this.cards = input
            .filter((line) => !!line)
            .map((line) => {
                const { groups } =
                    line.match(
                        /Card (?<id>[\s\d]+): (?<winningNumbers>[\d\s]+)\| (?<numbers>[\d\s]+)/
                    ) ?? {};
                return {
                    id: Number(groups?.id.trim()),
                    winningNumbers:
                        groups?.winningNumbers
                            .split(" ")
                            .filter((n) => !!n && n !== " ")
                            .map(Number) ?? [],
                    numbers:
                        groups?.numbers
                            .split(" ")
                            .filter((n) => !!n && n !== " ")
                            .map(Number) ?? [],
                };
            });
    }

    solvePart1() {
        let sum = 0;
        for (let i = 0; i < this.cards.length; i++) {
            sum += this.getCardPoints(this.cards[i]);
        }
        return sum;
    }

    solvePart2() {
        let sum = 0;
        for (let i = 0; i < this.cards.length; i++) {
            sum += this.getNumberOfCards(i);
        }
        return sum;
    }

    private getNumberOfCards(cardIndex: number): number {
        if (cardIndex >= this.cards.length) {
            return 0;
        }
        const winCount = this.getWinCount(this.cards[cardIndex]);
        let numberOfCards = 0;
        for (let i = cardIndex + 1; i <= cardIndex + winCount; i++) {
            numberOfCards += this.getNumberOfCards(i);
        }
        return numberOfCards + 1;
    }

    private getCardPoints(card: ScratchCard): number {
        const winCount = this.getWinCount(card);
        if (winCount === 0) {
            return 0;
        }
        return 2 ** (winCount - 1);
    }

    public getWinCount(card: ScratchCard): number {
        if (this.winCountCache.has(card.id)) {
            return this.winCountCache.get(card.id) ?? 0;
        }
        const winCount = card.numbers.reduce((acc, number) => {
            if (card.winningNumbers.includes(number)) {
                acc++;
            }
            return acc;
        }, 0);
        this.winCountCache.set(card.id, winCount);
        return winCount;
    }
}
