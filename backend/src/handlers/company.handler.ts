import { Request, Response, Router } from "express";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import { processServiceError } from "../lib/api/process-error";
import { BaggageRuleEntry, CompanyEntry } from "../types/company.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/user.type";
import { body, ValidationChain } from "express-validator";
import {
	applyOptionalFlag,
	getFilepathValidation,
	getForeignKeyValidation,
} from "../lib/api/validation-chain";

export class CompanyHandler {
	private static getChain(optional: boolean = false): ValidationChain[] {
		const validators: ValidationChain[] = [
			body("name")
				.isLength({ min: 3, max: 255 })
				.withMessage("company name must be valid"),
			getFilepathValidation("logo"),
			getForeignKeyValidation("baggage_rule_id"),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static addCompany(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const { name, logo, baggage_rule_id }: CompanyEntry = req.body;
			req.dependencies.companyService.addCompany({
				name,
				logo,
				baggage_rule_id,
			});
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getCompanies(req: Request, res: Response): void {
		try {
			const companies = req.dependencies.companyService.getAllCompanies();
			res.json(ResponseTypes.ok({ companies }));
		} catch (err) {
			processServiceError(res, err);
		}
	}

	private static getCompanyRuleByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const company = req.dependencies.companyService.getCompanyDTOByID(id);
			res.json(ResponseTypes.ok({ baggage_rule: company.baggage_rule }));
		} catch (err) {
			processServiceError(res, err);
		}
	}

	private static getCompanyByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const company = req.dependencies.companyService.getCompanyDTOByID(id);
			res.json(ResponseTypes.ok({ company }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateCompany(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const id = parseInt(req.params.id);
			req.dependencies.companyService.updateCompanyByID(id, req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static removeCompany(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.companyService.removeCompanyByID(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static addRule(req: Request, res: Response): void {
		try {
			const { max_free_weight, price_per_kg }: BaggageRuleEntry = req.body;
			req.dependencies.companyService.addBaggageRule({
				max_free_weight,
				price_per_kg,
			});
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateRuleByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.companyService.updateBaggageRuleByID(id, req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();

		// Guest routes
		router.get("/:id", this.getCompanyByID);
		router.get("/:id/rule", this.getCompanyRuleByID);
		router.get("/", this.getCompanies);

		// Admin routes
		router.post(
			"/",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getChain(),
			this.addCompany
		);
		router.put(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getChain(true),
			this.updateCompany
		);
		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.removeCompany
		);
		router.post(
			"/rule",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.addRule
		);
		router.put(
			"/rule/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.updateRuleByID
		);

		return router;
	}
}
