import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/repository/user";
import { body, check, ValidationChain } from "express-validator";
import { getForeignKeyValidation } from "../lib/api/validation-chain";
import { DISCOUNT_REGEX } from "../lib/service/const";
import { DiscountHandler } from "./discount.handler";

export class BookingHandler {
	private static getAddBookingChain(): ValidationChain[] {
		return [
			getForeignKeyValidation("flight_id"),
			getForeignKeyValidation("payment_id"),
			body("seats")
				.isInt({ min: 1 })
				.withMessage("min seats to reserve is positive number from 1"),
			body("baggage_weight")
				.isInt({ min: 0 })
				.withMessage("baggage weight is positive number"),
			body("code")
				.optional()
				.matches(DISCOUNT_REGEX)
				.withMessage("discount code must be valid"),
		];
	}

	private static async getBookingByID(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const bookingID = parseInt(req.params.id);
			const { role, id } = req.token_data;
			const booking = await req.dependencies.bookingService.getBookingById(
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

	private static async calculatePrice(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { flight_id, seats, code, baggage_weight } = req.body;
			const { id: user_id } = req.token_data;
			const { details } = await req.dependencies.bookingService.calculatePrice(
				user_id,
				flight_id,
				baggage_weight,
				seats,
				code
			);
			res.json(ResponseTypes.ok({ details }));
		} catch (err) {
			processServiceError(res, err);
		}
	}

	private static async addBooking(req: Request, res: Response): Promise<void> {
		if (!checkValidation(req, res)) return;
		try {
			const { flight_id, seats, code, baggage_weight, payment_id } = req.body;
			const { id: user_id } = req.token_data;
			await req.dependencies.bookingService.add({
				user_id,
				flight_id,
				seats,
				baggage_weight,
				payment_id,
				code,
			});
			res.status(201).send();
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async getBookingsByToken(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { id } = req.token_data;
			const bookings = await req.dependencies.bookingService.getUserBookings(
				id
			);
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

	private static async deleteBooking(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const booking_id = parseInt(req.params.id);
			const { role, id } = req.token_data;
			await req.dependencies.bookingService.deleteBooking(booking_id, id, role);
			res.status(204).send();
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async updateBookingStatus(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const booking_id = parseInt(req.params.id);
			const { role, id } = req.token_data;
			const { status } = req.body;
			await req.dependencies.bookingService.updateBookingStatus(
				id,
				role,
				booking_id,
				status
			);
			res.status(204).send();
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	private static async getTrandingBookings(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const limit = parseInt(req.params.limit ?? 10);
			const tranding = await req.dependencies.bookingService.getTrending(limit);
			res.json(ResponseTypes.ok({ tranding }));
		} catch (err) {
			processServiceError(res, err);
			return;
		}
	}

	public static router(): Router {
		const router = Router();
		// Guest routes
		router.get("/tranding", this.getTrandingBookings);

		// User discount handler
		router.use("/discounts", DiscountHandler.router());

		router.get(
			"/all",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.getAllBookings
		);
		router.post(
			"/price",
			[authorizationMiddleware],
			this.calculatePrice
		);

		// Auth routes
		router.post(
			"/",
			[authorizationMiddleware],
			this.getAddBookingChain(),
			this.addBooking
		);
		router.get("/", [authorizationMiddleware], this.getBookingsByToken);
		router.get("/:id", [authorizationMiddleware], this.getBookingByID);
		router.put(
			"/:id/status",
			[authorizationMiddleware],
			this.updateBookingStatus
		);

		router.delete(
			"/:id",
			[authorizationMiddleware, roleMiddleware(Roles.Admin)],
			this.deleteBooking
		);
		return router;
	}
}
