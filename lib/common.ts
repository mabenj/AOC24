import prettyMs from "npm:pretty-ms";

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function prettyNumber(number: number | undefined) {
    if (typeof number === "undefined") {
        return "";
    }
    return NUMBER_FORMATTER.format(number);
}

export function prettyDuration(durationMs: number) {
    if (durationMs < 1) {
        return `${durationMs.toFixed(1)}ms`;
    }
    return prettyMs(durationMs);
}

export const LINE_SEPARATOR = "\n";

export function determineLatestPuzzle(): { year: string; day: string } {
    const now = new Date();
    const start = getCurrentAocStart();
    const end = getCurrentAocEnd();
    if (now < start) {
        // last year's last puzzle
        return {
            year: (start.getFullYear() - 1).toString().slice(-2),
            day: "25",
        };
    }
    if (now < end) {
        // current year's current puzzle
        const today = now.getUTCDate();
        const hour = now.getUTCHours();
        const day = hour >= 5 ? today : today - 1;
        return {
            year: start.getFullYear().toString().slice(-2),
            day: day.toString(),
        };
    }

    // current year's last puzzle
    return {
        year: start.getFullYear().toString().slice(-2),
        day: "25",
    };

    function getCurrentAocStart() {
        const timestamp = new Date("2024-12-01T05:00:00Z"); // 1st of December midnight EST/UTC-5
        timestamp.setFullYear(new Date().getFullYear());
        return timestamp;
    }

    function getCurrentAocEnd() {
        const end = new Date(getCurrentAocStart());
        end.setDate(25);
        return end;
    }
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

export function reverseString(str: string) {
    return str.split("").reverse().join("");
}

export async function fileExists(path: string) {
    try {
        await Deno.lstat(path);
        return true;
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        return false;
    }
}

export function toDictionary<T, K extends keyof T>(
    array: T[],
    key: K
): Record<string, T> {
    return array.reduce((acc, curr) => {
        const keyValue = curr[key]?.toString();
        if (keyValue) {
            acc[keyValue] = curr;
        }
        return acc;
    }, {} as Record<string, T>);
}

export function groupBy<T, K extends keyof T>(array: T[], key: K) {
    return array.reduce((acc, curr) => {
        const keyValue = curr[key]?.toString();
        if (keyValue) {
            acc[keyValue] = acc[keyValue] ?? [];
            acc[keyValue].push(curr);
        }
        return acc;
    }, {} as Record<string, T[]>);
}

// deno-lint-ignore no-explicit-any
export function memoize<R, T extends (...args: any[]) => R>(f: T): T {
    const memory = new Map<string, R>();

    // deno-lint-ignore no-explicit-any
    const g = (...args: any[]) => {
        if (!memory.get(args.join())) {
            memory.set(args.join(), f(...args));
        }

        return memory.get(args.join());
    };

    return g as T;
}

export function sumNumbers(...numbers: number[]) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
