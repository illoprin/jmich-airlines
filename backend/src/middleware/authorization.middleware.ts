import { NextFunction, Request, Response } from "express";

export function authorizationMiddleware(req : Request, res: Response, next : NextFunction): void {
	// TODO: authorization middleware
	res.status(403).json({messge: "access denied"});
	return;
}