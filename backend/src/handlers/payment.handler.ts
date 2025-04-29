import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import type { PaymentEntry } from "../types/payment.type";
import {
	ForbiddenError,
	InvalidFieldError,
	NotFoundError,
} from "../types/service.type";
import { AccessControl } from "../lib/service/access-control";
import { Roles } from "../types/user.type";
import { processServiceError } from "../lib/api/process-error";

export class PaymentHandler {
	public static addPayment(req: Request, res: Response): void {
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

	public static getPayments(req: Request, res: Response): void {
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

	public static getPaymentByID(req: Request, res: Response): void {
		try {
			const id: number = parseInt(req.params.id);
			const payment = req.dependencies.userService.getPaymentByID(
				req.token_data.id,
				req.token_data.role,
				id
			);
			res.json(ResponseTypes.ok<PaymentEntry>(payment));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static deletePaymentByID(req: Request, res: Response): void {
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

	public static router(): Router {
		const router = Router();
		router.post("/", authorizationMiddleware, this.addPayment);
		router.get("/", authorizationMiddleware, this.getPayments);
		router.get("/:id", authorizationMiddleware, this.getPaymentByID);
		router.delete("/:id", authorizationMiddleware, this.deletePaymentByID);
		return router;
	}
}
