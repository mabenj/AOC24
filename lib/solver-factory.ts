import { PuzzleSolver } from "./types/puzzle-solver.ts";
import Solver23D1 from "./23D1/solver.ts";
import Solver23D2 from "./23D2/solver.ts";
import Solver23D3 from "./23D3/solver.ts";
import Solver24D1 from "./24D1/solver.ts";
import Solver24D2 from "./24D2/solver.ts";
import Solver24D3 from "./24D3/solver.ts";

export default class SolverFactory {
    private static readonly solverMap: { [id: string]: PuzzleSolver } = {};

    private constructor() {}

    static {
        SolverFactory.registerSolver("23D1", new Solver23D1());
        SolverFactory.registerSolver("23D2", new Solver23D2());
        SolverFactory.registerSolver("23D3", new Solver23D3());
        SolverFactory.registerSolver("24D1", new Solver24D1());
        SolverFactory.registerSolver("24D2", new Solver24D2());
        SolverFactory.registerSolver("24D3", new Solver24D3());
    }

    static getSolver(id: string): PuzzleSolver {
        const solver = this.solverMap[id];
        if (solver) {
            return solver;
        }
        throw new Error(`No solver found for ${id}`);
    }

    static getSolverIds(): string[] {
        return Object.keys(this.solverMap);
    }

    private static registerSolver(id: string, solver: PuzzleSolver) {
        this.solverMap[id] = solver;
    }
}
