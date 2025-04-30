import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";
import { processServiceError } from "../lib/api/process-error";

export class CompanyHandler {
	private static addCompany(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getCompanies(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
		}
	}

	private static getCompanyByID(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateCompany(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static deleteCompany(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateRuleByID(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static addRule(req: Request, res: Response): void {
		try {
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();

		// Admin routes
		router.post("/", this.addCompany);
		router.get("/", this.getCompanies);
		router.get("/:id", this.getCompanyByID);
		router.put("/:id", this.updateCompany);
		router.delete("/:id", this.deleteCompany);

		router.post("/rule", this.addRule);
		router.put("/rule/:id", this.updateRuleByID);

		return router;
	}
}
