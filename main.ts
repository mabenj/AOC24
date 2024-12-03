import { parseArgs } from "jsr:@std/cli/parse-args";
import solve from "./lib/commands/solve.ts";
import init from "./lib/commands/init.ts";
import "jsr:@std/dotenv/load";
import { determineLatestPuzzle } from "./lib/common.ts";

const flags = parseArgs(Deno.args, {
    string: ["d", "day", "p", "part", "y", "year"],
});

async function main() {
    const verb = flags._[0]?.toString()?.toLowerCase();
    const day = flags.d || flags.day || determineLatestPuzzle().day;
    const part = flags.p || flags.part || "1";
    const year = flags.y || flags.year || determineLatestPuzzle().year;

    if ((part !== "1" && part !== "2") || +day < 1 || +day > 25) {
        return printUsage();
    }

    switch (verb) {
        case "solve":
            return await solve(year, day, part);
        case "init":
            return await init(year, day);
        default:
            return printUsage();
    }
}

function printUsage() {
    console.log("Usage:");
    console.log(
        "    main.ts solve [-d, --day <day>] [-p, --part <1 | 2>] [-y, --year <year>]"
    );
    console.log("    main.ts init [-d, --day <day>] [-y, --year <year>]");
}

if (import.meta.main) {
    main()
        .then(() => Deno.exit(0))
        .catch((e) => {
            console.error(e);
            Deno.exit(1);
        });
}
