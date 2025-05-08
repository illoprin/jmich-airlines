import { NextFunction, Request, Response } from "express";

export type MiddlewareFunc = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;

export type HTTPHandlerFunc = (req: Request, res: Response) => void;
