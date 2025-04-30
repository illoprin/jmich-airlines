import { NextFunction, Request, Response } from "express";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
	const t1 : number = Date.now();

	res.on("finish", () => {
		const contentLen = res.getHeader('Content-Length') as number;
		const responseSize = contentLen ? contentLen : 0
		const duration = Date.now() - t1;
		const { method, originalUrl } = req;
		const { statusCode } = res;
		console.log(
			`[${new Date().toLocaleString()}] ${method} ${originalUrl} - ${statusCode} | ${duration}ms | ${responseSize || "?"} bytes`
		);
	});

	next();
}