import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import { DiscountEntry } from "../types/repository/discount";
import { authorizationMiddleware } from "@/middleware/authorization.middleware";
import { roleMiddleware } from "@/middleware/role.middleware";
import { Roles } from "@/types/repository/user";
import { body, ValidationChain } from "express-validator";
import { getDateValidation } from "@/lib/api/validation-chain";

export class DiscountHandler {
	private static getChain(): ValidationChain[] {
		return [
			body("code")
				.matches(/^[a-zA-Z0-9-]+$/g)
				.withMessage(
					"discount code must not contain spaces or other special chars"
				),
			body("amount")
				.isFloat({ min: 0, max: 1 })
				.withMessage("discount amount must be a number between 0 and 1"),
			getDateValidation("valid_until"),
		];
	}

	private static validateDiscount(req: Request, res: Response): void {
		const code = req.params.code;
		try {
			const discount = req.dependencies.discountService.getDiscountByCode(code);
			res.json(ResponseTypes.ok({ discount }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static addDiscount(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const discount: DiscountEntry = req.body;
			discount.valid_until = new Date(discount.valid_until);
			req.dependencies.discountService.add(discount);
			res.status(201);
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static removeDiscountByCode(req: Request, res: Response): void {
		try {
			const code = req.params.code;
			req.dependencies.discountService.removeByCode(code);
			res.status(204);
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();

		// PERF
		router.post(
			"/validate/:code",
			authorizationMiddleware,
			this.validateDiscount
		);

		// PERF
		router.post(
			"/",
			[authorizationMiddleware, roleMiddleware(Roles.Moderator)],
			this.getChain(),
			this.addDiscount
		);
		// PERF
		router.delete(
			"/:code",
			[authorizationMiddleware, roleMiddleware(Roles.Moderator)],
			this.removeDiscountByCode
		);

		return router;
	}
}
