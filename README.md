# 🎄 Advent of Code in Deno/TypeScript

## Solutions

1. *deno 2.1.2, windows x86_64, 31.93 GB, AMD Ryzen 7 5800X3D 8-Core Processor*

| 2024 | Part 1 | Part 2 |
| --- | --- | --- |
| [Day 1](/lib/24D1/solver.ts) | 1ms 50µs 399ns <sup>1</sup> | 819µs 500ns <sup>1</sup> |
| [Day 2](/lib/24D2/solver.ts) | 964µs 199ns <sup>1</sup> | 1ms 504µs 500ns <sup>1</sup> |
| [Day 3](/lib/24D3/solver.ts) | 1ms 516µs 199ns <sup>1</sup> | 1ms 545µs 400ns <sup>1</sup> |
| [Day 4](/lib/24D4/solver.ts) | 2ms 827µs 799ns <sup>1</sup> | 2ms 430µs 399ns <sup>1</sup> |
| [Day 5](/lib/24D5/solver.ts) | 2ms 26µs 800ns <sup>1</sup> | 2ms 125µs <sup>1</sup> |
| [Day 6](/lib/24D6/solver.ts) | 4ms 350µs 200ns <sup>1</sup> | 6.9s <sup>1</sup> |
| [Day 7](/lib/24D7/solver.ts) | 115ms <sup>1</sup> | 8.3s <sup>1</sup> |
| [Day 8](/lib/24D8/solver.ts) | 1ms 699ns <sup>1</sup> | 1ms 870µs 300ns <sup>1</sup> |
| [Day 9](/lib/24D9/solver.ts) | 962ms <sup>1</sup> | 422ms <sup>1</sup> |

| 2023 | Part 1 | Part 2 |
| --- | --- | --- |
| [Day 1](/lib/23D1/solver.ts) | 784µs 100ns <sup>1</sup> | 22ms <sup>1</sup> |
| [Day 2](/lib/23D2/solver.ts) | 813µs 600ns <sup>1</sup> | 860µs 600ns <sup>1</sup> |
| [Day 3](/lib/23D3/solver.ts) | 2ms 277µs 99ns <sup>1</sup> | 1ms 355µs 199ns <sup>1</sup> |
| [Day 4](/lib/23D4/solver.ts) | 1ms 181µs 600ns <sup>1</sup> | 111ms <sup>1</sup> |
| [Day 5](/lib/23D5/solver.ts) | 771µs 399ns <sup>1</sup> | 14.5s <sup>1</sup> |

> Generated at Mon, 09 Dec 2024 23:15:29 GMT

## Prerequisites

-   [Deno](https://deno.land/)

## Setup

1. `git clone` this repository
2. `cd` into the repository

❗ Note: to start from scratch without my solutions, delete all the puzzle directories and the `solver-factory,ts` file in the `lib` directory.

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
deno main.ts solve [-d, --day <day>] [-p, --part <1 | 2>] [-y, --year <year>]
```

Initialize and scaffold a new puzzle directory into the `lib` directory:

```
deno main.ts init [-d, --day <day>] [-y, --year <year>]
```

_Defaults:_

-   `day` defaults to the day of the latest puzzle
-   `year` defaults to the year of the latest AoC
-   `part` defaults to 1

❗ Note: to use the `init` command to automatically scaffold a new puzzle directory and to fetch your input and problem description, you will need to set the `AOC_SESSION` environment variable to your Advent of Code session cookie. You can achieve this by creating a `.env` file with `AOC_SESSION=<session cookie>` in the root of your project (see .env.example). This same variable is also used to submit answers after solving a puzzle.

## Testing

`deno test` will run all the solvers and test their output

❗ Note: the tests expects the `lib/tests/main_test-answers.json` file to contain the correct answers for the puzzles.
