import { Request, Response, Router } from "express";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import { Roles, type UserPublicDTO, type UserEntry } from "../types/user.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { processServiceError } from "../lib/api/process-error";
import { PaymentHandler } from "./payment.handler";
import { ValidationChain } from "express-validator";
import { body } from "express-validator";
import { applyOptionalFlag } from "../lib/api/validation-chain";
import { LOGIN_REGEX, SINGLE_UNICODE_WORD_REGEX } from "../lib/service/const";

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
		if (!checkValidation(req, res)) return;
		try {
			const id = req.token_data.id;
			const allowAccessHeader: string | undefined = req.get("Allow-Access");
			console.log(allowAccessHeader);
			let allowRoleChaning: boolean = false;
			if (allowAccessHeader) {
				allowRoleChaning = allowAccessHeader === "1" ? true : false;
			}
			const token = req.dependencies.userService.update(
				id,
				req.body,
				allowRoleChaning
			);
			// WARN: return new access token after changing a role or login is bad practice in my opinion
			token
				? res.json(ResponseTypes.ok({ token }))
				: res.json(ResponseTypes.ok({ token }));
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
		router.post("/", this.getChain(), this.registerUser);
		router.post("/login", this.login);

		// Auth private routes
		router.get("/", authorizationMiddleware, this.getByToken);
		router.put(
			"/",
			authorizationMiddleware,
			this.getChain(true),
			this.updateByToken
		);
		router.delete("/", authorizationMiddleware, this.deleteByToken);

		// Auth routes
		router.get("/:id", authorizationMiddleware, this.getUserByID);

		// Admin routes
		router.get(
			"/all",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAll
		);

		// Use payment routes
		router.use("/payment", PaymentHandler.router());

		return router;
	}
}
