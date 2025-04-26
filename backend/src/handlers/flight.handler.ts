import { Request, Response, Router } from "express";
import { ResponseTypes } from "../lib/api/response";

export class FlightHandler {
	private static addFlight(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	private static addRandomFlights(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	private static updateFlight(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	private static deleteFlight(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	private static searchFlights(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	private static searchNearestFlights(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	private static updateFlightStatus(req: Request, res: Response): void {
		try {
		} catch (err) {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
	public static router(): Router {
		const router = Router();
		// Guest routes
		// Auth routes
		// Admin routes
		return router;
	}
}
