import { Request, Response, Router } from "express";
import type { HTTPHandlerFunc } from "../types/middlewaree.type";
import { ResponseTypes } from "../lib/api/response";

export class UserHandler {
	public static registerUser() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static loginUser() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static getUser() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static verifyUser() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {
				
			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static getAllUsers() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	public static router() : Router {
		// TODO: integrate middleware
		const router = Router();
		router.post('/', this.registerUser());
		router.post('/login', this.loginUser());
		router.post('/verify', this.verifyUser());
		router.get('/', this.getUser());
		router.get('/all', this.getAllUsers());
		return router;
	}
}