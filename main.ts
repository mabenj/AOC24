import { parseArgs } from "jsr:@std/cli/parse-args";
import solve from "./lib/commands/solve.ts";
import init from "./lib/commands/init.ts";
import "jsr:@std/dotenv/load";

const flags = parseArgs(Deno.args, {
    string: ["d", "day", "p", "part", "y", "year"],
});

async function main() {
    const verb = flags._[0]?.toString()?.toLowerCase();
    const day = flags.d || flags.day || getDefaultDay();
    const part = flags.p || flags.part || "1";
    const year = flags.y || flags.year || getDefaultYear();

    switch (verb) {
        case "solve":
            if (!day || !["1", "2"].includes(part)) {
                return printUsage();
            }
            return await solve(year, day, part);
        case "init":
            if (!day) {
                return printUsage();
            }
            return init(year, day);
        default:
            return printUsage();
    }
}

function printUsage() {
    console.log("Usage:");
    console.log("    main.ts solve [-d <day>] [-p <1 | 2>] [-y <year>]");
    console.log("    main.ts init [-d <day>] [-y <year>]");
}

function getDefaultDay() {
    const date = new Date();
    const day = date.getDate();
    return Math.min(day, 25).toString();
}

function getDefaultYear() {
    const date = new Date();
    return date.getFullYear().toString().slice(-2);
}

if (import.meta.main) {
    main()
        .then(() => Deno.exit(0))
        .catch((e) => {
            console.error(e);
            Deno.exit(1);
        });
}
