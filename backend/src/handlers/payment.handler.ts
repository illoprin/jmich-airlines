import { Request, Response, Router } from "express";
import type { HTTPHandlerFunc } from "../types/middlewaree.type";
import { ResponseTypes } from "../lib/api/response";

export class PaymentHandeler {
	public static addPayment() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static getPayments() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static getPaymentByID() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static deletePayment() : HTTPHandlerFunc {
		return (req: Request, res: Response) => {
			try {

			} catch (err) {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}
	public static router() : Router {
			const router = Router();
			// TODO: integrate middleware
			router.post('/', this.addPayment());
			router.get('/', this.getPayments());
			router.get('/:id', this.getPaymentByID());
			router.delete('/:id', this.deletePayment());
			return router;
		}
}