import { ResponseTypes } from "../lib/api/response";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/user.type";
import { AirportEntry, CityEntry } from "../types/city.type";
import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";

export class CityHandler {
	private static addCity(req: Request, res: Response): void {
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
			req.dependencies.cityService.getAirportsByCityID(city_id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static addCityAirport(req: Request, res: Response): void {
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
			req.dependencies.cityService.removeCityAirportByCodeAndCityID(cityID, code);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateAirport(req: Request, res: Response): void {
		try {
			const cityID = parseInt(req.params.id);
			const code = req.params.code;
			req.dependencies.cityService.updateAirportByCodeAndCityID(cityID, code, req.body);
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
			this.addCity
		);
		router.post(
			"/:id/airport",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
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
			this.updateAirport
		);
		router.put(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.updateCity
		);
		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.removeCityByID
		);

		return router;
	}
}
