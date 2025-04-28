import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";
import type {
	FlightEntry,
	FlightSearchPayload,
	FlightStatus,
} from "../types/flight.type";
import { RelatedDataError, InvalidFieldError, NotFoundError } from "../types/service.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/user.type";

export class FlightHandler {
	private static addFlight(req: Request, res: Response): void {
		try {
			const entry: FlightEntry = req.body;
			req.dependencies.flightService.add(entry);
			res.send(ResponseTypes.ok({}));
		} catch (err) {
			if (err instanceof InvalidFieldError) {
				res.status(400).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
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
		} catch (err) {
			if (err instanceof InvalidFieldError) {
				res.status(400).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static deleteFlight(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			req.dependencies.flightService.removeByID(id);
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else if (err instanceof RelatedDataError) {
				res.status(405).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static searchFlights(req: Request, res: Response): void {
		try {
			const query: FlightSearchPayload = req.body;
			const flights = req.dependencies.flightService.search(query);
			res.json(ResponseTypes.ok({ flights }));
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static getFlightByID(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const flight = req.dependencies.flightService.getByID(id);
			res.json(flight);
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	private static updateFlightStatus(req: Request, res: Response): void {
		try {
			const id = parseInt(req.params.id);
			const status: FlightStatus = req.body.status;
			req.dependencies.flightService.updateStatus(id, status);
		} catch (err) {
			if (err instanceof NotFoundError) {
				res.status(404).json(ResponseTypes.error(err.message));
			} else {
				res.status(500).json(ResponseTypes.internalError());
			}
		}
	}

	public static router(): Router {
		const router = Router();

		// Guest routes
		router.get("/search", this.searchFlights);
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
