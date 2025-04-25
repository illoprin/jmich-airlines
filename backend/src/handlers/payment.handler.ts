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

export class PaymentHandler {
	public static addPayment(req: Request, res: Response): void {
		try {
			const payment: PaymentEntry = req.body;
			payment.user_id = req.token_data.id;
			req.dependencies.userService.addPayment(payment);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			if (err instanceof InvalidFieldError) {
				res.status(400).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	public static getPayments(req: Request, res: Response): void {
		try {
			const user_id = req.token_data.id;
			const payment: PaymentEntry[] =
				req.dependencies.userService.getPaymentsByUserID(
					user_id
				) as PaymentEntry[];
			res.json(ResponseTypes.ok({payment}));
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error("payment methods not found"));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	public static getPaymentByID(req: Request, res: Response): void {
		try {
			const id: number = parseInt(req.params.id);
			const payment = AccessControl.checkAccess<PaymentEntry>(
				req,
				Roles.Admin,
				id,
				(id) => req.dependencies.userService.getPaymentByID(id)
			);
			res.json(ResponseTypes.ok<PaymentEntry>(payment));
		} catch (err) {
			console.log(err);
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else if (err instanceof ForbiddenError) {
				res.status(403).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	public static deletePaymentByID(req: Request, res: Response): void {
		try {
			const id: number = parseInt(req.params.id);
			AccessControl.checkAccess<PaymentEntry>(
				req,
				Roles.Admin,
				id,
				(id) => req.dependencies.userService.getPaymentByID(id)
			);
			req.dependencies.userService.deletePayment(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			console.log(err);
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error("not found"));
			} else if (err instanceof ForbiddenError) {
				res.status(403).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
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
