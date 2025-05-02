import { checkValidation, ResponseTypes } from "../lib/api/response";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/user.type";
import { AirportEntry, CityEntry } from "../types/city.type";
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
			body("name").matches(SINGLE_UNICODE_WORD_REGEX),
			getFilepathValidation("image"),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static getAirportChain(optional: boolean = false): ValidationChain[] {
		const validators = [
			body("name").matches(SOME_WORDS_SINGLE_SPACE_REGEX),
			body("code").matches(/^[A-Z]{3}$/g),
		];
		return applyOptionalFlag(validators, optional);
	}

	private static addCity(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const { name, image } = req.body;
			const city: CityEntry = {
				name,
				image,
			};
			req.dependencies.cityService.addCity(city);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateCity(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const id = parseInt(req.params.id);
			req.dependencies.cityService.updateCityByID(id, req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getCityByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const city = req.dependencies.cityService.getCityByID(id);
			res.json(ResponseTypes.ok({ city }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static removeCityByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.cityService.removeCityByID(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getAllCities(req: Request, res: Response): void {
		try {
			const cities = req.dependencies.cityService.getAllCities();
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

	private static addCityAirport(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const { name, code } = req.body;
			const city_id = parseInt(req.params.id);

			const airport: AirportEntry = {
				name,
				code,
				city_id,
			};

			req.dependencies.cityService.addAirport(airport);

			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static removeCityAirport(req: Request, res: Response): void {
		try {
			const cityID = parseInt(req.params.id);
			const code = req.params.code;
			req.dependencies.cityService.removeCityAirportByCodeAndCityID(
				cityID,
				code
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateAirport(req: Request, res: Response): void {
		if (!checkValidation(req, res)) return;
		try {
			const cityID = parseInt(req.params.id);
			const code = req.params.code;
			req.dependencies.cityService.updateAirportByCodeAndCityID(
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
		router.get("/", this.getAllCities);
		router.get("/:id", this.getCityByID); // Returns city DTO
		router.get("/:id/airports", this.getCityAirports); // Returns city airports

		// Admin
		router.post(
			"/",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getCityChain(),
			this.addCity
		);
		router.put(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getCityChain(true),
			this.updateCity
		);
		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.removeCityByID
		);
		
		router.post(
			"/:id/airport",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAirportChain(),
			this.addCityAirport
		);
		router.delete(
			"/:id/airport/:code",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.removeCityAirport
		);
		router.put(
			"/:id/airport/:code",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAirportChain(),
			this.updateAirport
		);

		return router;
	}
}
