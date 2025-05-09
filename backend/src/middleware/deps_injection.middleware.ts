import { NextFunction, Request, Response } from "express";
import type { MiddlewareFunc } from "../types/internal/middleware";
import { Dependencies } from "../service";

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
