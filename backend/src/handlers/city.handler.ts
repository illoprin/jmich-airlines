import { checkValidation, ResponseTypes } from "../lib/api/response";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/repository/user";
import { AirportEntry, CityEntry } from "../types/repository/city";
import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { body, ValidationChain } from "express-validator";
import {
	SINGLE_UNICODE_WORD_REGEX,
	SOME_WORDS_SINGLE_SPACE_REGEX,
} from "../lib/service/const";
import {
	applyOptionalFlag,
	getFilepathValidation,
} from "../lib/api/validation-chain";

export class CityHandler {
	private static getCityChain(optional: boolean = false): ValidationChain[] {
		const validators = [
			body("name")
				.matches(SINGLE_UNICODE_WORD_REGEX)
				.withMessage("city name is a single word, allowed hyphen"),
			getFilepathValidation("image"),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static getAirportChain(optional: boolean = false): ValidationChain[] {
		const validators = [
			body("name")
				.matches(SOME_WORDS_SINGLE_SPACE_REGEX)
				.withMessage("invalid name"),
			body("code")
				.matches(/^[A-Z]{3}$/g)
				.withMessage("invalid code"),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static async addCity(req: Request, res: Response): Promise<void> {
		if (!checkValidation(req, res)) return;
		try {
			const { name, image } = req.body;
			const city: CityEntry = {
				name,
				image,
			};
			await req.dependencies.cityService.addCity(city);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async updateCity(req: Request, res: Response): Promise<void> {
		if (!checkValidation(req, res)) return;
		try {
			const id = parseInt(req.params.id);
			await req.dependencies.cityService.updateCityByID(id, req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async getCityByID(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const city = await req.dependencies.cityService.getCityByID(id);
			res.json(ResponseTypes.ok({ city }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async removeCityByID(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			await req.dependencies.cityService.removeCityByID(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async getAllCities(req: Request, res: Response): Promise<void> {
		try {
			const cities = await req.dependencies.cityService.getAllCities();
			res.json(ResponseTypes.ok({ cities }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getCityAirports(req: Request, res: Response): void {
		try {
			const city_id = parseInt(req.params.id);
			const airports =
				req.dependencies.cityService.getAirportsByCityID(city_id);
			res.json(ResponseTypes.ok({ airports }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async addCityAirport(req: Request, res: Response): Promise<void> {
		if (!checkValidation(req, res)) return;
		try {
			const { name, code } = req.body;
			const city_id = parseInt(req.params.id);

			const airport: AirportEntry = {
				name,
				code,
				city_id,
			};

			await req.dependencies.cityService.addAirport(airport);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async removeCityAirport(req: Request, res: Response): Promise<void> {
		try {
			const cityID = parseInt(req.params.id);
			const code = req.params.code;
			await req.dependencies.cityService.removeCityAirportByCodeAndCityID(
				cityID,
				code
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async updateAirport(req: Request, res: Response): Promise<void> {
		if (!checkValidation(req, res)) return;
		try {
			const cityID = parseInt(req.params.id);
			const code = req.params.code;
			await req.dependencies.cityService.updateAirportByCodeAndCityID(
				cityID,
				code,
				req.body
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();

		// Guest routes
		// PERF
		router.get("/", this.getAllCities);
		// PERF
		router.get("/:id", this.getCityByID); // Returns city DTO
		// PERF
		router.get("/:id/airports", this.getCityAirports); // Returns city airports

		// Admin
		// PERF
		router.post(
			"/",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getCityChain(),
			this.addCity
		);
		// PERF
		router.put(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getCityChain(true),
			this.updateCity
		);
		// PERF
		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.removeCityByID
		);

		// PERF
		router.post(
			"/:id/airport",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAirportChain(),
			this.addCityAirport
		);
		// PERF
		router.delete(
			"/:id/airport/:code",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.removeCityAirport
		);
		// PERF
		router.put(
			"/:id/airport/:code",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAirportChain(),
			this.updateAirport
		);

		return router;
	}
}
