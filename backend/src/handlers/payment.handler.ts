import { Request, Response, Router } from "express";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import type { PaymentEntry } from "../types/payment.type";
import { processServiceError } from "../lib/api/process-error";
import { body, ValidationChain } from "express-validator";
import { applyOptionalFlag } from "../lib/api/validation-chain";

export class PaymentHandler {
	private static getChain(optional: boolean = false): ValidationChain[] {
		const validators: ValidationChain[] = [
			body("number")
				.matches(/^[0-9]{16}$/g)
				.withMessage("card number must be 16 digits string"),
			body("expires")
				.matches(/^[0-9]{4}$/g)
				.withMessage("expire date must be 4 digits string"),
			body("cvv")
				.matches(/^[0-9]{3}$/g)
				.withMessage("card cvv must be 3 digits string"),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static addPayment(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const payment: PaymentEntry = {
				number: req.body.number,
				expires: req.body.expires,
				cvv: req.body.cvv,
				user_id: req.token_data.id,
			};
			req.dependencies.userService.addPayment(payment);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getPayments(req: Request, res: Response): void {
		try {
			const user_id = req.token_data.id;
			const payment: PaymentEntry[] =
				req.dependencies.userService.getPaymentsByUserID(
					user_id
				) as PaymentEntry[];
			res.json(ResponseTypes.ok({ payment }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getPaymentByID(req: Request, res: Response): void {
		try {
			const id: number = parseInt(req.params.id);
			const payment = req.dependencies.userService.getPaymentByID(
				req.token_data.id,
				req.token_data.role,
				id
			);
			res.json(ResponseTypes.ok({ payment }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static deletePaymentByID(req: Request, res: Response): void {
		try {
			const id: number = parseInt(req.params.id);
			req.dependencies.userService.deletePayment(
				req.token_data.id,
				req.token_data.role,
				id
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updatePaymentByID(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		res.status(501).json(ResponseTypes.error("not implemented"));
	}

	public static router(): Router {
		const router = Router();
		router.post("/", authorizationMiddleware, this.getChain(), this.addPayment);
		router.get("/", authorizationMiddleware, this.getPayments);
		router.get("/:id", authorizationMiddleware, this.getPaymentByID);
		router.put(
			"/:id",
			authorizationMiddleware,
			this.getChain(true),
			this.updatePaymentByID
		);
		router.delete("/:id", authorizationMiddleware, this.deletePaymentByID);
		return router;
	}
}
