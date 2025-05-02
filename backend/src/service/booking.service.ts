import {
	generateQRCodeImageBuffer,
	getPayloadString,
} from "../lib/service/generate-qr";
import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import { AccessControl } from "../lib/service/access-control";
import type { BookingRepository } from "../repository/booking.repository";
import type { DiscountRepository } from "../repository/discount.repository";
import type { FlightRepository } from "../repository/flight.repository";
import type { UserRepository } from "../repository/user.repository";
import {
	type BookingDTO,
	type BookingEntry,
	BookingQRPayload,
	BookingStatus,
} from "../types/booking.type";
import {
	InvalidFieldError,
	RelatedDataError,
	NotFoundError,
} from "../types/service.type";
import { Roles } from "../types/user.type";
import { generateRandomGate } from "../lib/service/random";
import { saveBufferToFile } from "../lib/service/save-file";
import { Config } from "../types/config.type";
import { CompanyRepository } from "../repository/company.repository";
import { FlightStatus } from "../types/flight.type";

export class BookingService {
	constructor(
		private bookingRepo: BookingRepository,
		private discountRepo: DiscountRepository,
		private flightRepo: FlightRepository,
		private userRepo: UserRepository,
		private companyRepo: CompanyRepository,
		private cfg: Config
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
	 * @throws {QRCodeGenerationError}
	 * @throws {FileSaveError}
	 * @throws {RelatedDataError}
	 */
	public async add(
		userID: number,
		flightID: number,
		seats: number,
		baggageWeight: number,
		discountCode?: string
	): Promise<bigint> {
		// 0. Validate baggage & seats
		if (seats <= 0) {
			throw new InvalidFieldError(
				"seats reservation cannot be 0 or less then 0"
			);
		}
		if (baggageWeight < 0) {
			throw new InvalidFieldError(
				"baggage weight cannot be less then 0"
			);
		}

		// 1. Validate flight exists
		const flight = this.flightRepo.getDTOByID(flightID);
		if (!flight) {
			throw new RelatedDataError("flight not found");
		}
		if (flight.status !== FlightStatus.ACTIVE) {
			throw new InvalidFieldError("you cannot make reservation on inactive flight");
		}
		console.log("Booking flight price: ", flight.price);

		// 2. Get user public dto by id
		const user = this.userRepo.getPublicDataByID(userID);
		if (!user) {
			throw new RelatedDataError("user not found");
		}

		// 3. Apply discount if provided
		let finalCost = flight.price;
		if (discountCode) {
			const discount = this.discountRepo.getByCode(discountCode);
			if (!discount || new Date(discount.valid_until) < new Date()) {
				throw new InvalidFieldError("invalid or expired discount code");
			}
			finalCost = Math.max(0, finalCost * (1 - discount.amount));
			console.log(
				"Booking flight price after code: ",
				finalCost,
				"\nAmount is: ",
				discount.amount * 100,
				"%"
			);
		}

		// 4. Apply baggage price, if booking.baggage_weight > company.min_free_weight
		const company = this.companyRepo.getDTOByName(flight.company.name);
		if (!company) {
			throw new RelatedDataError("could not find company");
		}
		finalCost +=
			baggageWeight > company.baggage_rule.max_free_weight
				? (baggageWeight - company.baggage_rule.max_free_weight) *
				  company.baggage_rule.price_per_kg
				: 0;
		finalCost = Math.ceil(finalCost);

		console.log(
			"Booking flight price after baggage price applied:",
			finalCost,
			"\nBaggage weight is:",
			baggageWeight,
			"\nBaggage policy of company is:",
			company.baggage_rule
		);

		// 5. Collect other data
		const bookingCreated = new Date();

		// 5. Generate unique QR code
		const qrPayload: BookingQRPayload = {
			user_firstname: user.firstname,
			user_secondname: user.secondname,
			booking_cost: finalCost,
			booking_seats: seats,
			created: bookingCreated,
			route_code: flight.route_code,
			terminal_gate: generateRandomGate(),
		};
		const qrBuffer = await generateQRCodeImageBuffer(
			getPayloadString(qrPayload),
			16
		);

		// 5.1 Save QR Code buffer to file
		const fileName = saveBufferToFile(
			qrBuffer,
			this.cfg.booking_files_path,
			"png"
		);
		const qrCodeURL = `http://${this.cfg.http_server.host}:${this.cfg.http_server.port}/upload/booking/${fileName}`;

		// 6. Create booking entry
		try {
			const bookingId = this.bookingRepo.add({
				user_id: userID,
				flight_id: flightID,
				baggage_weight: baggageWeight,
				qr_code: qrCodeURL,
				created: bookingCreated,
				seats,
				cost: finalCost,
			});

			// 7. Update flight.seats_available count
			this.flightRepo.updateSeats(flightID, -seats);
			return bookingId;
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type === StorageErrorType.FOREIGN_KEY) {
					throw new NotFoundError("invalid foreign key");
				} else if (err.type === StorageErrorType.CHECK) {
					if (err.field.includes("BETWEEN")) {
						throw new InvalidFieldError(
							"there are not enough seats on the flight to make a reservation"
						);
					} else {
						throw new InvalidFieldError(err.message);
					}
				}
			}
			console.log(err);
			throw err;
		}
	}

	/**
	 * Gets booking by ID with access control
	 * @param userId - ID of the requesting user
	 * @param userRole - Role of the requesting user
	 * @param bookingID - ID of the booking to retrieve
	 * @returns Booking DTO if access granted
	 * @throws {NotFoundError}
	 * @throws {ForbiddenError}
	 */
	public getBookingById(
		userID: number,
		userRole: Roles,
		bookingID: number
	): BookingDTO {
		return AccessControl.checkAccess<BookingDTO>(
			userID,
			userRole,
			this.cfg.min_required_role,
			bookingID,
			(id) => this.bookingRepo.getDTOByID(id)
		);
	}

	/**
	 * Gets all bookings for a specific user
	 * @param userId - ID of the user whose bookings to retrieve
	 * @returns Array of booking DTOs
	 */
	public getUserBookings(userID: number): BookingDTO[] {
		return this.bookingRepo.getDTOByUserID(userID) || [];
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
	 * @param userId - ID of the requesting user
	 * @param userRole - Role of the requesting user
	 * @param bookingId - ID of the booking to update
	 * @param status - New status
	 * @throws {NotFoundError}
	 * @throws {ForbiddenError}
	 * @throws {InvalidFieldError}
	 */
	public updateBookingStatus(
		userId: number,
		userRole: Roles,
		bookingId: number,
		status: BookingStatus
	): void {
		try {
			AccessControl.checkAccess<BookingEntry>(
				userId,
				userRole,
				this.cfg.min_required_role,
				bookingId,
				(id) => this.bookingRepo.getByID(id)
			);
			const changes = this.bookingRepo.updateStatus(bookingId, status);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type === StorageErrorType.CHECK) {
					throw new InvalidFieldError("invalid status value");
				}
			} else {
				throw err;
			}
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
		userRole: Roles
	): void {
		AccessControl.checkAccess<BookingEntry>(
			userId,
			userRole,
			this.cfg.min_required_role,
			bookingId,
			(id) => this.bookingRepo.getByID(id)
		);

		this.bookingRepo.removeByID(bookingId);
	}

	public completeExpired(): number {
		const changes = this.bookingRepo.completeExpired(BookingStatus.COMPLETED);
		return changes;
	}
}
