import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";
import { Roles, type UserEntry } from "../types/user.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import {
	ForbiddenError,
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
} from "../types/service.type";

export class UserHandler {
	constructor() {}

	private static registerUser(req: Request, res: Response): void {
		try {
			// FIX: validate fields
			req.dependencies?.userService.register(req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			if (err instanceof NotUniqueError) {
				res.status(400).json(ResponseTypes.error(err.message));
			} else if (err instanceof InvalidFieldError) {
				res.status(400).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static login(req: Request, res: Response): void {
		try {
			const token = req.dependencies.userService.login(req.body);
			res.json(ResponseTypes.ok({ token }));
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else if (err instanceof ForbiddenError) {
				res.status(403).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static getByToken(req: Request, res: Response): void {
		try {
			const user: UserEntry = req.dependencies.userService.getByID(
				req.token_data.id
			) as UserEntry;
			res.json(ResponseTypes.ok<UserEntry>(user));
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
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
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error("user not exist"));
			} else if (err instanceof InvalidFieldError) {
				res.status(400).json(ResponseTypes.error(err.message));
			} else if (err instanceof NotUniqueError) {
				res.status(409).json(ResponseTypes.error(err.message));
			} else if (err instanceof ForbiddenError) {
				res.status(403).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static deleteByToken(req: Request, res: Response): void {
		try {
			const id = req.token_data.id;
			const changes: number = req.dependencies.userService.delete(id);
			if (!changes) {
				res.status(404).json(ResponseTypes.error("user not exist"));
				return;
			}
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}

	private static getAll(req: Request, res: Response): void {
		try {
			const user: UserEntry[] =
				req.dependencies.userService.getAll() as UserEntry[];
			res.json(ResponseTypes.ok({user}));
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	public static router(): Router {
		const router = Router();
		router.post("/", this.registerUser);
		router.post("/login", this.login);

		// Regular user auth routes
		router.get("/", authorizationMiddleware, this.getByToken);
		router.put("/", authorizationMiddleware, this.updateByToken);
		router.delete("/", authorizationMiddleware, this.deleteByToken);

		router.get(
			"/all",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAll
		);

		return router;
	}
}
