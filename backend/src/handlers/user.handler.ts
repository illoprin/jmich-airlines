import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";
import { Roles, type UserPublicDTO, type UserEntry } from "../types/user.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import {
	ForbiddenError,
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
} from "../types/service.type";
import { processServiceError } from "../lib/api/process-error";

export class UserHandler {
	constructor() {}

	private static registerUser(req: Request, res: Response): void {
		try {
			req.dependencies?.userService.register(req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static login(req: Request, res: Response): void {
		try {
			const token = req.dependencies.userService.login(req.body);
			res.json(ResponseTypes.ok({ token }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getByToken(req: Request, res: Response): void {
		try {
			const user: UserEntry = req.dependencies.userService.getByID(
				req.token_data.id
			) as UserEntry;
			res.json(ResponseTypes.ok<UserEntry>(user));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getUserByID(req: Request, res: Response): void {
		try {
			const id: number = parseInt(req.params.id);
			const reqUserID: number = req.token_data.id;
			if (reqUserID !== id) {
				const user = req.dependencies.userService.getPublicDataByID(
					id
				) as UserPublicDTO;
				res.json(ResponseTypes.ok<UserPublicDTO>(user));
			} else {
				const user = req.dependencies.userService.getByID(id) as UserEntry;
				res.json(ResponseTypes.ok<UserEntry>(user));
			}
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateByToken(req: Request, res: Response): void {
		try {
			const id = req.token_data.id;
			const roleChangeAllowed: string | undefined = req.get("Allow-Access");
			req.dependencies.userService.update(
				id,
				req.body,
				roleChangeAllowed === "1" ? true : false
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static deleteByToken(req: Request, res: Response): void {
		try {
			const id = req.token_data.id;
			req.dependencies.userService.delete(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getAll(req: Request, res: Response): void {
		try {
			const user: UserEntry[] =
				req.dependencies.userService.getAll() as UserEntry[];
			res.json(ResponseTypes.ok({ user }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();
		// Guest routes
		// FIX: validate fields
		router.post("/", this.registerUser);
		// FIX: validate fields
		router.post("/login", this.login);

		// Auth private routes
		router.get("/", authorizationMiddleware, this.getByToken);
		router.put("/", authorizationMiddleware, this.updateByToken);
		router.delete("/", authorizationMiddleware, this.deleteByToken);

		// Auth routes
		router.get("/:id", authorizationMiddleware, this.getUserByID);

		// Admin routes
		router.get(
			"/all",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAll
		);

		return router;
	}
}
