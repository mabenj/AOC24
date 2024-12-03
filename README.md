# Advent of Code in Deno/TypeScript

## Prerequisites

-   [Deno](https://deno.land/)

## Setup

1. `git clone` this repository
2. `cd` into the repository
3. `deno install` to install the dependencies

## Usage

`deno main.ts solve [-d, --day <day>] [-p, --part <1 | 2>] [-y, --year <year>]` will solve the puzzle for the given year, day and part.

`deno main.ts init [-d, --day <day>] [-y, --year <year>]` will initialize the puzzle for the given year and day into the `lib` directory.

**Defaults:**

-   `day` defaults to the current day or 25 if the current day is after the 25th.
-   `year` defaults to the current year.
-   `part` defaults to 1.

`deno test` will run the tests.
