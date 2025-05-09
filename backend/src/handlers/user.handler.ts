import { Request, Response, Router } from "express";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import { Roles, type UserEntry } from "../types/repository/user";
import type { UserPublicDTO } from "../types/dto/user";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { processServiceError } from "../lib/api/process-error";
import { PaymentHandler } from "./payment.handler";
import { ValidationChain } from "express-validator";
import { body } from "express-validator";
import { applyOptionalFlag } from "../lib/api/validation-chain";
import { LOGIN_REGEX, SINGLE_UNICODE_WORD_REGEX } from "../lib/service/const";
import { LikedFlightHandler } from "./liked-flight.handler";
import { NotificationHandler } from "./notification.handler";

export class UserHandler {
	private static getChain(optional: boolean = false): ValidationChain[] {
		const validators: ValidationChain[] = [
			body("login")
				.isLength({ min: 4, max: 255 })
				.matches(LOGIN_REGEX)
				.withMessage(
					"login string can contain latin chars and '_' '-' symbols"
				),
			body("password")
				.isLength({ min: 4, max: 255 })
				.withMessage("password length must between 4 and 255"),
			body("firstname")
				.matches(SINGLE_UNICODE_WORD_REGEX)
				.withMessage("firstname must be a single word"),
			body("secondname")
				.matches(SINGLE_UNICODE_WORD_REGEX)
				.withMessage("secondname must be a single word"),
			body("phone")
				.matches(/^[0-9]{10}$/g)
				.withMessage("phone must be a 10 digits string"),
			body("email")
				.isEmail({ allow_ip_domain: true })
				.withMessage("invalid email"),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static registerUser(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			req.dependencies?.userService.register(req.body);
			res.status(201);
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async login(req: Request, res: Response): Promise<void> {
		try {
			const token = await req.dependencies.userService.login(req.body);
			res.json(ResponseTypes.ok({ token }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async getByToken(req: Request, res: Response): Promise<void> {
		try {
			const user: UserEntry = (await req.dependencies.userService.getByID(
				req.token_data.id
			)) as UserEntry;
			res.json(ResponseTypes.ok({ user }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async getUserByID(req: Request, res: Response): Promise<void> {
		try {
			const id: number = parseInt(req.params.id);
			const reqUserID: number = req.token_data.id;
			// HACK: prevent access to protected data for admin
			if (reqUserID !== id) {
				const user = req.dependencies.userService.getPublicDataByID(
					id
				) as UserPublicDTO;
				res.json(ResponseTypes.ok({ user }));
			} else {
				const user = (await req.dependencies.userService.getByID(
					id
				)) as UserEntry;
				res.json(ResponseTypes.ok<UserEntry>(user));
			}
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async updateByToken(
		req: Request,
		res: Response
	): Promise<void> {
		if (!checkValidation(req, res)) return;
		try {
			const id = req.token_data.id;
			const allowAccessHeader: string | undefined = req.get("Allow-Access");
			console.log(allowAccessHeader);
			let allowRoleChaning: boolean = false;
			if (allowAccessHeader) {
				allowRoleChaning = allowAccessHeader === "1" ? true : false;
			}
			const token = await req.dependencies.userService.update(
				id,
				req.body,
				allowRoleChaning
			);
			// WARN: return new access token after changing a role or login is bad practice in my opinion
			token ? res.json(ResponseTypes.ok({ token })) : res.status(204);
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async deleteByToken(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const id = req.token_data.id;
			await req.dependencies.userService.delete(id);
			res.status(204);
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getAll(req: Request, res: Response): void {
		try {
			const users: UserEntry[] =
				req.dependencies.userService.getAll() as UserEntry[];
			res.json(ResponseTypes.ok({ users }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();
		// Use payment routes
		router.use("/payment", PaymentHandler.router());
		// Use liked flight handler
		router.use("/liked", LikedFlightHandler.router());
		// User notification handler
		router.use("/notification", NotificationHandler.router());

		// Guest routes
		// PERF
		router.post("/", this.getChain(), this.registerUser);
		// PERF
		router.post("/login", this.login);

		// Admin routes
		// PERF
		router.get(
			"/all",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAll
		);

		// Auth private routes
		// PERF
		router.get("/", authorizationMiddleware, this.getByToken);
		// PERF
		router.put(
			"/",
			authorizationMiddleware,
			this.getChain(true),
			this.updateByToken
		);
		// PERF
		router.delete("/", authorizationMiddleware, this.deleteByToken);

		// PERF
		router.get("/:id", authorizationMiddleware, this.getUserByID);

		return router;
	}
}
