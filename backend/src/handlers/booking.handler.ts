import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { ResponseTypes } from "../lib/api/response";
import type { BookingDTO } from "../types/booking.type";

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
			res.json(ResponseTypes.ok<BookingDTO>(booking));
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
				code ?? undefined
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
			res.json(ResponseTypes.ok({bookings}));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static getAllBookings(req: Request, res: Response): void {
		try {
			const { max, page } = req.params;
			const bookings = req.dependencies.bookingService.getAllBookings(parseInt(max), parseInt(page));
			res.json(ResponseTypes.ok({bookings}));
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
			req.dependencies.bookingService.updateBookingStatus(id, role, booking_id, status);
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
		router.get("/:id", this.getBookingByID);
		router.post("/", this.newBooking);
		router.get("/", this.getBookingsByToken);

		// Admin routes
		router.get("/all/:max:page", this.getAllBookings);
		router.delete("/:id", this.deleteBooking);
		router.put("/status/:id", this.updateBookingStatus);
		return router;
	}
}
