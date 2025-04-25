import { NextFunction, Request, Response } from "express";
import type { UserService } from "../service/user.service";
import type { Config } from "./config.type";

export type MiddlewareFunc = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;
export type HTTPHandlerFunc = (req: Request, res: Response) => void;

export interface Dependencies {
	userService: UserService;
	cfg: Config;
}
