import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { ResponseTypes } from "../lib/api/response";
import type { BookingDTO } from "../types/booking.type";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/user.type";

export class BookingHandler {
	private static getBookingByID(req: Request, res: Response): void {
		try {
			const bookingID = parseInt(req.params.id);
			const { role, id } = req.token_data;
			const booking = req.dependencies.bookingService.getBookingById(
				id,
				role,
				bookingID
			);
			res.json(ResponseTypes.ok({ booking }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static newBooking(req: Request, res: Response): void {
		try {
			// FIX: validate fields
			const { flight_id, seats, code, baggage_weight } = req.body;
			const { id: user_id } = req.token_data;
			req.dependencies.bookingService.createBooking(
				user_id,
				flight_id,
				seats,
				baggage_weight,
				code || undefined
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getBookingsByToken(req: Request, res: Response): void {
		try {
			const { id } = req.token_data;
			const bookings = req.dependencies.bookingService.getUserBookings(id);
			res.json(ResponseTypes.ok({ bookings }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getAllBookings(req: Request, res: Response): void {
		try {
			const max = parseInt(req.query.limit as string);
			const page = parseInt(req.query.page as string);
			const bookings = req.dependencies.bookingService.getAllBookings(
				max,
				page
			);
			res.json(ResponseTypes.ok({ bookings }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static deleteBooking(req: Request, res: Response): void {
		try {
			const booking_id = parseInt(req.params.id);
			const { role, id } = req.token_data;
			req.dependencies.bookingService.deleteBooking(booking_id, id, role);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static updateBookingStatus(req: Request, res: Response): void {
		try {
			// FIX: validate fields
			const booking_id = parseInt(req.params.id);
			const { role, id } = req.token_data;
			const { status } = req.body;
			req.dependencies.bookingService.updateBookingStatus(
				id,
				role,
				booking_id,
				status
			);
			res.json(ResponseTypes.ok({}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getTrandingBookings(req: Request, res: Response): void {
		res.status(501).json(ResponseTypes.error("not implemented"));
	}

	public static router(): Router {
		const router = Router();
		// Guest routes
		router.get("/tranding", this.getTrandingBookings);

		// Auth routes
		router.get("/:id", [authorizationMiddleware], this.getBookingByID);
		router.post("/", [authorizationMiddleware], this.newBooking);
		router.get("/", [authorizationMiddleware], this.getBookingsByToken);
		router.put(
			"/status/:id",
			[authorizationMiddleware],
			this.updateBookingStatus
		);

		// Admin routes
		router.get(
			"/all",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAllBookings
		);
		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.deleteBooking
		);
		return router;
	}
}
