import { PuzzleSolver } from "./types/puzzle-solver.ts";
import Solver23D1 from "./23D1/solver.ts";
import Solver23D2 from "./23D2/solver.ts";
import Solver23D3 from "./23D3/solver.ts";
import Solver23D4 from "./23D4/solver.ts";
import Solver23D5 from "./23D5/solver.ts";
import Solver24D1 from "./24D1/solver.ts";
import Solver24D2 from "./24D2/solver.ts";
import Solver24D3 from "./24D3/solver.ts";
import Solver24D4 from "./24D4/solver.ts";
import Solver24D5 from "./24D5/solver.ts";
import Solver24D6 from "./24D6/solver.ts";
import Solver24D7 from "./24D7/solver.ts";
import Solver24D8 from "./24D8/solver.ts";
import Solver24D9 from "./24D9/solver.ts";
import Solver24D10 from "./24D10/solver.ts";
import Solver24D11 from "./24D11/solver.ts";
import Solver24D12 from "./24D12/solver.ts";
import Solver24D13 from "./24D13/solver.ts";
import Solver24D14 from "./24D14/solver.ts";
import Solver24D15 from "./24D15/solver.ts";
import Solver24D16 from "./24D16/solver.ts";
import Solver24D17 from "./24D17/solver.ts";
import Solver24D18 from "./24D18/solver.ts";
import Solver24D19 from "./24D19/solver.ts";
import Solver24D20 from "./24D20/solver.ts";
import Solver24D21 from "./24D21/solver.ts";
import Solver24D22 from "./24D22/solver.ts";

export default class SolverFactory {
    private static readonly solverMap: { [id: string]: PuzzleSolver } = {};

    private constructor() {}

    static {
        SolverFactory.registerSolver("23D1", new Solver23D1());
        SolverFactory.registerSolver("23D2", new Solver23D2());
        SolverFactory.registerSolver("23D3", new Solver23D3());
        SolverFactory.registerSolver("23D4", new Solver23D4());
        SolverFactory.registerSolver("23D5", new Solver23D5());
        SolverFactory.registerSolver("24D1", new Solver24D1());
        SolverFactory.registerSolver("24D2", new Solver24D2());
        SolverFactory.registerSolver("24D3", new Solver24D3());
        SolverFactory.registerSolver("24D4", new Solver24D4());
        SolverFactory.registerSolver("24D5", new Solver24D5());
        SolverFactory.registerSolver("24D6", new Solver24D6());
        SolverFactory.registerSolver("24D7", new Solver24D7());
        SolverFactory.registerSolver("24D8", new Solver24D8());
        SolverFactory.registerSolver("24D9", new Solver24D9());
        SolverFactory.registerSolver("24D10", new Solver24D10());
        SolverFactory.registerSolver("24D11", new Solver24D11());
        SolverFactory.registerSolver("24D12", new Solver24D12());
        SolverFactory.registerSolver("24D13", new Solver24D13());
        SolverFactory.registerSolver("24D14", new Solver24D14());
        SolverFactory.registerSolver("24D15", new Solver24D15());
        SolverFactory.registerSolver("24D16", new Solver24D16());
        SolverFactory.registerSolver("24D17", new Solver24D17());
        SolverFactory.registerSolver("24D18", new Solver24D18());
        SolverFactory.registerSolver("24D19", new Solver24D19());
        SolverFactory.registerSolver("24D20", new Solver24D20());
        SolverFactory.registerSolver("24D21", new Solver24D21());
        SolverFactory.registerSolver("24D22", new Solver24D22());
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