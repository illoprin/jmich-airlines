import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";
import type {
	FlightEntry,
	FlightSearchPayload,
	FlightStatus,
} from "../types/flight.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/user.type";
import { processServiceError } from "../lib/api/process-error";

export class FlightHandler {
	private static addFlight(req: Request, res: Response): void {
		try {
			const {
				departure_airport_id,
				departure_date,
				arrival_airport_id,
				arrival_date,
				route_code,
				price,
				seats_available,
				company_id
			}: FlightEntry = req.body;
			req.dependencies.flightService.add({
				departure_airport_id,
				departure_date: new Date(departure_date),
				arrival_airport_id,
				arrival_date: new Date(arrival_date),
				route_code,
				company_id,
				price,
				seats_available,
			});
			res.send(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	private static addRandomFlights(req: Request, res: Response): void {
		// TODO
		res.status(501).send(ResponseTypes.error("not implemented"));
	}

	private static updateFlight(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.flightService.updateGeneral(id, req.body);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	private static deleteFlight(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.flightService.removeByID(id);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	private static searchFlights(req: Request, res: Response): void {
		try {
			const payload: FlightSearchPayload = req.body;
			payload.departure_date = new Date(req.body.departure_date as string);
			payload.max = parseInt(req.query.limit as string);
			payload.page = parseInt(req.query.page as string);
			const flights = req.dependencies.flightService.search(payload);
			res.json(ResponseTypes.ok({ flights }));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	private static getFlightByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const flight = req.dependencies.flightService.getByID(id);
			res.json(ResponseTypes.ok({ flight }));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	private static updateFlightStatus(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const status: FlightStatus = req.body.status;
			req.dependencies.flightService.updateStatus(id, status);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	private static getAllFlights(req: Request, res: Response): void {
		try {
			const max = parseInt(req.query.limit as string);
			const page = parseInt(req.query.page as string);
			const flights = req.dependencies.flightService.getAll(max, page);
			res.json(ResponseTypes.ok({ flights }));
		} catch (err) {
			processServiceError(res, req);
			return;
		}
	}

	public static router(): Router {
		const router = Router();

		// Guest routes
		// NOTE: I use post method for search so that url can contain query params
		router.post("/search", this.searchFlights);
		router.get("/:id", this.getFlightByID);

		// Moderator routes
		router.post(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Moderator)],
			this.addFlight
		);
		router.put(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Moderator)],
			this.updateFlight
		);
		router.put(
			"/status/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Moderator)],
			this.updateFlightStatus
		);
		router.get("/all",
			[authorizationMiddleware, roleMiddleware(Roles.Moderator)],
			this.getAllFlights
		)

		// Admin routes
		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.deleteFlight
		);
		router.post(
			"/random",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.addRandomFlights
		);

		return router;
	}
}
