# Advent of Code in Deno/TypeScript

## Prerequisites

-   [Deno](https://deno.land/)

## Setup

1. `git clone` this repository
2. `cd` into the repository
3. `deno install` to install the dependencies

## Usage

Solve the puzzle for the given year, day and part:

```
deno main.ts solve [-d, --day <day>] [-p, --part <1 | 2>] [-y, --year <year>]
```

Initialize the puzzle for the given year and day into the `lib` directory:

```
deno main.ts init [-d, --day <day>] [-y, --year <year>]
```

_Defaults:_

-   `day` defaults to the latest puzzle
-   `year` defaults to the latest puzzle
-   `part` defaults to 1

## Testing

`deno test` will run the tests
