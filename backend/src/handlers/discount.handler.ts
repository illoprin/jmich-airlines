import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { ResponseTypes } from "../lib/api/response";
import { DiscountEntry } from "../types/discount.type";

export class DiscountHandler {
	private validateDiscount(req: Request, res: Response): void {
		const code = req.params.code;
		try {
			const discount = req.dependencies.discountService.getDiscountByCode(code);
			res.json(ResponseTypes.ok({discount}));
		} catch(err) {
			processServiceError(res, err);
			return;
		}

	}

	private addDiscount(req: Request, res: Response): void {
		try {
			const discount: DiscountEntry = req.body;
			req.dependencies.discountService.add(discount);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private removeDiscountByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.discountService.removeByID(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public router(): Router {
		const router = Router();

		// Auth routes
		router.post("/validate/:code", this.validateDiscount);
		
		// Moderator routes
		router.delete("/:id", this.removeDiscountByID);
		router.post("/", this.addDiscount);

		return router;
	}
}