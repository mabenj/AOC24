# Advent of Code in Deno/TypeScript

## Prerequisites

-   [Deno](https://deno.land/)

## Setup

1. `git clone` this repository
2. `cd` into the repository
3. `deno install -e main.ts` to install the dependencies

❗ Note: to start from scratch without my solutions, delete everything inside the `lib` directory except for the `commands` and `types` directories and the `common.ts` file.

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

❗ Note: to use the `init` command to automatically fetch the puzzle input and problem description, you will need to set the `AOC_SESSION` environment variable to your Advent of Code session cookie. You can achieve this by creating a `.env` file with `AOC_SESSION=<session cookie>` in the root of your project. This same variable is also used to submit answers after solving a puzzle.

## Testing

`deno test` will run all the solvers and test their output
