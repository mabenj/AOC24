# 🎄 Advent of Code in Deno/TypeScript

## Solutions

1. *deno 2.1.2, windows x86_64, 15.91 GB, AMD Ryzen 5 3600 6-Core Processor*
2. *deno 2.1.2, windows x86_64, 31.76 GB, Intel(R) Core(TM) i7-9850H CPU @ 2.60GHz*
3. *deno 2.1.2, windows x86_64, 31.93 GB, AMD Ryzen 7 5800X3D 8-Core Processor*

| 2024 | Part 1 | Part 2 |
| :--- | ---: | ---: |
| [Day 1](/lib/24D1/solver.ts) | 1ms <sup>3</sup> | 0.8ms <sup>3</sup> |
| [Day 2](/lib/24D2/solver.ts) | 1.0ms <sup>3</sup> | 1ms <sup>3</sup> |
| [Day 3](/lib/24D3/solver.ts) | 2ms <sup>3</sup> | 2ms <sup>3</sup> |
| [Day 4](/lib/24D4/solver.ts) | 3ms <sup>3</sup> | 3ms <sup>3</sup> |
| [Day 5](/lib/24D5/solver.ts) | 2ms <sup>3</sup> | 2ms <sup>3</sup> |
| [Day 6](/lib/24D6/solver.ts) | 4ms <sup>3</sup> | 6.9s <sup>3</sup> |
| [Day 7](/lib/24D7/solver.ts) | 114ms <sup>3</sup> | 8.2s <sup>3</sup> |
| [Day 8](/lib/24D8/solver.ts) | 1.0ms <sup>3</sup> | 2ms <sup>3</sup> |
| [Day 9](/lib/24D9/solver.ts) | 960ms <sup>3</sup> | 436ms <sup>3</sup> |
| [Day 10](/lib/24D10/solver.ts) | 8ms <sup>2</sup> | 7ms <sup>2</sup> |
| [Day 11](/lib/24D11/solver.ts) | 2ms <sup>3</sup> | 38ms <sup>3</sup> |
| [Day 12](/lib/24D12/solver.ts) | 31ms <sup>2</sup> | 37ms <sup>2</sup> |
| [Day 13](/lib/24D13/solver.ts) | 0.8ms <sup>3</sup> | 0.7ms <sup>3</sup> |
| [Day 14](/lib/24D14/solver.ts) | 0.7ms <sup>3</sup> | 198ms <sup>3</sup> |
| [Day 15](/lib/24D15/solver.ts) | 2ms <sup>3</sup> | 6ms <sup>3</sup> |
| [Day 16](/lib/24D16/solver.ts) | 154ms <sup>2</sup> | 725ms <sup>2</sup> |
| [Day 17](/lib/24D17/solver.ts) | 0.2ms <sup>1</sup> | 0.2ms <sup>1</sup> |
| [Day 18](/lib/24D18/solver.ts) | 4ms <sup>3</sup> | 15ms <sup>3</sup> |
| [Day 19](/lib/24D19/solver.ts) | 20ms <sup>2</sup> | 46ms <sup>2</sup> |
| [Day 20](/lib/24D20/solver.ts) | 135ms <sup>1</sup> | 285ms <sup>1</sup> |
| [Day 21](/lib/24D21/solver.ts) | N/A  | N/A  |
| [Day 22](/lib/24D22/solver.ts) | 74ms <sup>1</sup> | 1.5s <sup>1</sup> |

| 2023 | Part 1 | Part 2 |
| :--- | ---: | ---: |
| [Day 1](/lib/23D1/solver.ts) | 0.8ms <sup>3</sup> | 22ms <sup>3</sup> |
| [Day 2](/lib/23D2/solver.ts) | 0.8ms <sup>3</sup> | 0.8ms <sup>3</sup> |
| [Day 3](/lib/23D3/solver.ts) | 2ms <sup>3</sup> | 1ms <sup>3</sup> |
| [Day 4](/lib/23D4/solver.ts) | 1ms <sup>3</sup> | 112ms <sup>3</sup> |
| [Day 5](/lib/23D5/solver.ts) | 0.8ms <sup>3</sup> | 14.5s <sup>3</sup> |

[![Generate README](https://github.com/mabenj/aoc-deno-ts/actions/workflows/generate-readme.yml/badge.svg)](https://github.com/mabenj/aoc-deno-ts/actions/workflows/generate-readme.yml)
> Generated at Mon, 23 Dec 2024 23:55:40 GMT

## Prerequisites

-   [Deno](https://deno.land/)

## Setup

1. `git clone` this repository
2. `cd` into the repository

❗ Note: to start from scratch without my solutions, delete all the puzzle directories and the `solver-factory.ts` file in the `lib` directory.

## Project Structure

```
📦
├─ lib/
│  ├─ yyDd/                       # puzzle directory for year `yy` and day `d`
│  │  ├─ input.txt                # input for the puzzle (git ignored)
│  │  ├─ puzzle.md                # problem description (git ignored)
│  │  └─ solver.ts                # solution for the puzzle
│  ├─ commands/
│  │  ├─ init.ts                  # command to scaffold a new puzzle directory
│  │  └─ solve.ts                 # command to solve a puzzle
│  ├─ tests/
│  │  ├─ main_test.ts             # unit tests for all the solvers
│  │  └─ main_test_answers.json   # correct answers for the puzzles
│  ├─ common.ts                   # common utility code
│  └─ solver-factory.ts           # factory for creating solvers
├─ deno.json                      # Deno configuration
└─ main.ts                        # entry point for the program
```

## Usage

Solve the puzzle for the given year, day and part:

```
deno run solve [-d, --day <day>] [-p, --part <1 | 2>] [-y, --year <year>]
```

Initialize and scaffold a new puzzle directory into the `lib` directory:

```
deno run init [-d, --day <day>] [-y, --year <year>]
```

_Defaults:_

-   `day` defaults to the day of the latest puzzle
-   `year` defaults to the year of the latest AoC
-   `part` defaults to 1

❗ Note: to use the `init` command to automatically scaffold a new puzzle directory and to fetch your input and problem description, you will need to set the `AOC_SESSION` environment variable to your Advent of Code session cookie. You can achieve this by creating a `.env` file with `AOC_SESSION=<session cookie>` in the root of your project (see .env.example). This same variable is also used to submit answers after solving a puzzle.

## Testing

`deno test` will run all the solvers and test their output

❗ Note: the tests expects the `lib/tests/main_test-answers.json` file to contain the correct answers for the puzzles.
