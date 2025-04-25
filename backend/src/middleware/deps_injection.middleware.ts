import { NextFunction, Request, Response } from "express";
import type { Dependencies, MiddlewareFunc } from "../types/middlewaree.type";

declare global {
	namespace Express {
		interface Request {
			dependencies: Dependencies;
		}
	}
}

export function dependencyInjectionMiddleware(deps: Dependencies): MiddlewareFunc {
	return (req: Request, res: Response, next: NextFunction) => {
		req.dependencies = deps;
		next();
	};
}
