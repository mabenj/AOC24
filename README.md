# 🎄 Advent of Code in Deno/TypeScript

## Solutions

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
