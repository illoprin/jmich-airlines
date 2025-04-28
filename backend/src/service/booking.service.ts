import { generateQRCode } from "../lib/qr-code/generate-qr";
import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import type { BookingRepository } from "../repository/booking.repository";
import type { DiscountRepository } from "../repository/discount.repository";
import type { FlightRepository } from "../repository/flight.repository";
import type { UserRepository } from "../repository/user.repository";
import { type BookingDTO, BookingStatus } from "../types/booking.type";
import {
	InvalidFieldError,
	RelatedDataError,
	NotFoundError,
	AuthorizationError,
	ForbiddenError,
} from "../types/service.type";

export class BookingService {
	constructor(
		private bookingRepo: BookingRepository,
		private discountRepo: DiscountRepository,
		private flightRepo: FlightRepository,
		private userRepo: UserRepository
	) {}

	/**
	 * Creates a new booking
	 * @param userID - ID of the user making the booking
	 * @param flightID - ID of the flight being booked
	 * @param baggageWeight - Weight of baggage
	 * @param discountCode - Optional discount code
	 * @returns Created booking DTO
	 * @throws {InvalidFieldError}
	 * @throws {NotFoundError}
	 * @throws {RelatedDataError}
	 */
	public createBooking(
		userID: number,
		flightID: number,
		baggageWeight: number,
		discountCode?: string
	): BookingDTO {
		// 1. Validate flight exists
		const flight = this.flightRepo.getDTOByID(flightID);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}

		// 2. Get user public dto by id
		const user = this.userRepo.getPublicDataByID(userID);
		if (!user) {
			throw new NotFoundError("user not found");
		}

		// 3. Apply discount if provided
		let finalCost = flight.price;
		if (discountCode) {
			const discount = this.discountRepo.getByCode(discountCode);
			if (!discount || new Date(discount.valid_until) < new Date()) {
				throw new InvalidFieldError("invalid or expired discount code");
			}
			finalCost = Math.max(0, finalCost * (1 - discount.amount));
		}

		// 4. Apply baggage price, if booking.baggage_weight > company.min_free_weight
		if (flight.company.baggage_rule) {
			finalCost +=
				baggageWeight > flight.company.baggage_rule.max_free_weight
					? (baggageWeight - flight.company.baggage_rule.max_free_weight) *
					  flight.company.baggage_rule.price_per_kg
					: 0;
		} else {
			// NOTE: we can get company baggage rule from company repo
			throw new RelatedDataError("cannot get company baggage rule");
		}

		// 4. Generate unique QR code
		const qrCode = generateQRCode(user, flight, new Date());

		// 5. Create booking entry
		try {
			const bookingId = this.bookingRepo.add({
				user_id: userID,
				flight_id: flightID,
				baggage_weight: baggageWeight,
				qr_code: qrCode,
				cost: finalCost,
				status: BookingStatus.ACTIVE,
			});

			// 6. Return complete DTO
			const bookingDTO = this.bookingRepo.getDTOByID(Number(bookingId));
			if (!bookingDTO) {
				throw new Error("failed to retrieve created booking");
			}
			return bookingDTO;
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type === StorageErrorType.FOREIGN_KEY) {
					throw new NotFoundError(err.message);
				} else if (err.type === StorageErrorType.CHECK) {
					throw new InvalidFieldError(err.message);
				}
			}
			throw err;
		}
	}

	/**
	 * Gets booking by ID with access control
	 * @param bookingId - ID of the booking to retrieve
	 * @param userId - ID of the requesting user
	 * @param userRole - Role of the requesting user
	 * @returns Booking DTO if access granted
	 * @throws {NotFoundError}
	 * @throws {ForbiddenError}
	 */
	public getBookingById(bookingId: number): BookingDTO {
		// NOTE: think about access control integration
		const booking = this.bookingRepo.getDTOByID(bookingId);
		if (!booking) {
			throw new NotFoundError("Booking not found");
		}
		return booking;
	}

	/**
	 * Gets all bookings for a specific user
	 * @param userId - ID of the user whose bookings to retrieve
	 * @returns Array of booking DTOs
	 */
	public getUserBookings(userId: number): BookingDTO[] {
		// NOTE: think about access control integration
		return this.bookingRepo.getDTOByUserID(userId) || [];
	}

	/**
	 * Gets all bookings (admin only)
	 * @param max max entries on page
	 * @param page page number
	 * @returns Array of all booking DTOs
	 */
	public getAllBookings(max: number, page: number): BookingDTO[] {
		return this.bookingRepo.getDTOAll(max, page) || [];
	}

	/**
	 * Updates booking status
	 * @param bookingId - ID of the booking to update
	 * @param status - New status
	 * @param userId - ID of the requesting user
	 * @param userRole - Role of the requesting user
	 * @throws {NotFoundError}
	 * @throws {ForbiddenError}
	 * @throws {InvalidFieldError}
	 */
	public updateBookingStatus(
		bookingId: number,
		status: BookingStatus,
		userId: number,
		userRole: string
	): void {
		// NOTE: think about access control integration
		const booking = this.bookingRepo.getByID(bookingId);
		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		// Only admin or booking owner can update status
		if (userRole !== "ADMIN" && booking.user_id !== userId) {
			throw new ForbiddenError("Cannot update booking status");
		}

		try {
			this.bookingRepo.updateStatus(bookingId, status);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type === StorageErrorType.CHECK) {
					throw new InvalidFieldError("Invalid status value");
				}
			}
			throw err;
		}
	}

	/**
	 * Deletes a booking
	 * @param bookingId - ID of the booking to delete
	 * @param userId - ID of the requesting user
	 * @param userRole - Role of the requesting user
	 * @throws {NotFoundError}
	 * @throws {ForbiddenError}
	 */
	public deleteBooking(
		bookingId: number,
		userId: number,
		userRole: string
	): void {
		const booking = this.bookingRepo.getByID(bookingId);
		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		// Only admin or booking owner can delete
		if (userRole !== "ADMIN" && booking.user_id !== userId) {
			throw new ForbiddenError("Cannot delete booking");
		}

		this.bookingRepo.removeByID(bookingId);
	}
}
