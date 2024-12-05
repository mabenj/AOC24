import prettyMs from "npm:pretty-ms";

export function prettyDuration(durationMs: number) {
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
        const today = now.getDate();
        return {
            year: start.getFullYear().toString().slice(-2),
            day: today.toString(),
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
