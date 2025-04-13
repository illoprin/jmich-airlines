import { NextFunction, Request, Response } from "express";

export function authorizationMiddleware(req : Request, res: Response, next : NextFunction): void {
	if (req.method == "OPTIONS") {
		next();
	}
	
	// TODO: authorization middleware
	return;
}