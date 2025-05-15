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
import {
  BookingPriceDetails,
  CreateBookingPayload,
  type BookingDTO,
} from "../types/dto/booking";
import type {
  TrandingBookingsDTO,
  BookingQRPayload,
} from "../types/features/booking";
import {
  BookingEntry,
  BookingStatus,
} from "../types/repository/booking";
import {
  InvalidFieldError,
  RelatedDataError,
  NotFoundError,
  PaymentError,
  ForbiddenError,
} from "../lib/service/errors";
import { Roles, UserLevel } from "../types/repository/user";
import { generateRandomGate } from "../lib/service/random";
import { saveBufferToFile } from "../lib/service/save-file";
import { Config } from "../types/internal/config";
import { FlightStatus } from "../types/repository/flight";
import { PaymentRepository } from "../repository/payment.repository";
import { BookingCache } from "../redis/booking.cache";
import { FlightService } from "./flight.service";
import { UserService } from "./user.service";
import { PaymentEntry } from "@/types/repository/payment";
import { FlightDTO } from "@/types/dto/flight";
import { DiscountService } from "./discount.service";
import { CompanyService } from "./company.service";
import { UserPublicDTO } from "@/types/dto/user";
import { UserLevelDiscountRule } from "@/types/features/user";
import { CARD_CVV_REGEX, CARD_EXPIRES_REGEX, CARD_NUMBER_REGEX } from "@/lib/service/const";

export class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private bookingCache: BookingCache,
    private discountService: DiscountService,
    private flightService: FlightService,
    private userService: UserService,
    private companyService: CompanyService,
    private paymentRepo: PaymentRepository,
    private cfg: Config
  ) {}

  private validateFields(baggageWeight: number, seats: number) {
    // Validate baggage, seats and payment id
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
  }

  private validatePayment(
    payment: PaymentEntry | undefined,
    payment_id: number | undefined
  ): PaymentEntry | undefined {
    if (payment_id) {
      // Validate payment
      const p = this.paymentRepo.getByID(payment_id);
      if (!p) {
        throw new PaymentError("invalid payment");
      }
      return p;
    }
    if (payment !== undefined) {
      if (!CARD_NUMBER_REGEX.test(payment.number) ||
        !CARD_EXPIRES_REGEX.test(payment.expires) ||
        !CARD_CVV_REGEX.test(payment.cvv)) {
          throw new PaymentError("invalid payment");
      }
      return payment;
    }
    return undefined;
  }


  private async validateFlight(
    flight_id: number
  ): Promise<FlightDTO> {
    // Validate flight exists
    const flight = await this.flightService.getByID(flight_id);
    if (!flight) {
      throw new RelatedDataError("flight not found");
    }
    if (flight.status !== FlightStatus.ACTIVE) {
      throw new InvalidFieldError(
        "you cannot make reservation on inactive flight"
      );
    }
    return flight;
  }

  private calculateUserLevelDiscount(level: UserLevel): number {
    const rule = UserLevelDiscountRule[level];

    let totalDiscount = rule.discount;

    return totalDiscount;
  }

  private async calculateHotTourDiscount(
    level: UserLevel,
    flight_id: number
  ): Promise<number> {
    const isInTrending = (await this.getTrending(10)).some(
      (t) => t.flight_id === flight_id
    );
    if (!isInTrending) {
      return 0.0;
    }
    return UserLevelDiscountRule[level].trendingFlightBonus;
  }

  /**
   * Calculates price of ticket
   * @returns {BookingPriceDetails}
   * @throws {RelatedDataError}
   * @throws {InvalidFieldError}
   * @throws {NotFoundError}
   * @throws {PaymentError}
   */
  public async calculatePrice(
    user_id: number,
    flight_id: number,
    baggage_weight: number,
    seats: number,
    code: string | undefined
  ): Promise<{
    user: UserPublicDTO;
    flight: FlightDTO;
    details: BookingPriceDetails;
  }> {
    this.validateFields(baggage_weight, seats);

    const flight = await this.validateFlight(flight_id);

    const user = await this.userService.getPublicDataByID(user_id);

    const company = await this.companyService.getCompanyDTOByID(
      flight.company.id as number
    );

    // Apply discount
    let discountCodeAmount: number = 0;
    if (code) {
      const discountEntry =
        this.discountService.getDiscountByCode(code);
      discountCodeAmount = discountEntry.amount;
    }

    // Apply baggage price
    let baggage_price = 0;
    if (company?.baggage_rule) {
      baggage_price =
        baggage_weight > company.baggage_rule.max_free_weight
          ? (baggage_weight - company.baggage_rule.max_free_weight) *
            company.baggage_rule.price_per_kg
          : 0;
    }

    // Get discount based on user level
    const userLevelDiscount: number = this.calculateUserLevelDiscount(
      user.level
    );

    // Get hot tour discount
    const hotToursDiscount: number =
      await this.calculateHotTourDiscount(user.level, flight_id);

    // Calculate final discount and clamp that to 40%
    const finalDiscount =
      discountCodeAmount + userLevelDiscount + hotToursDiscount;
    // Calculate final cost
    const finalCost = Math.ceil(
      Math.max(
        (flight.price + baggage_price) * (1.0 - finalDiscount),
        0
      )
    );
    return {
      flight,
      user,
      details: {
        total_cost: finalCost,
        base_ticket_price: flight.price + baggage_price,
        additional_discount: hotToursDiscount,
        code_discount: discountCodeAmount,
        level_discount: userLevelDiscount,
      },
    };
  }

  /**
   * Creates a new booking
   * @param userID - ID of the user making the booking
   * @param flightID - ID of the flight being booked
   * @param paymentID - ID of user's payment method
   * @param seats - number of seats
   * @param baggageWeight - Weight of baggage
   * @param code - Optional discount code
   * @throws {InvalidFieldError}
   * @throws {NotFoundError}
   * @throws {PaymentError}
   * @throws {QRCodeGenerationError}
   * @throws {FileSaveError}
   * @throws {RelatedDataError}
   */
  public async add({
    user_id,
    flight_id,
    baggage_weight,
    seats,
    code,
    payment,
    payment_id,
  }: CreateBookingPayload): Promise<bigint> {
    const {
      flight,
      user,
      details: priceDetails,
    } = await this.calculatePrice(
      user_id,
      flight_id,
      baggage_weight,
      seats,
      code
    );

    this.validatePayment(payment, payment_id);
    // NOTE: $$$ you can save temprory payment

    const creationDate = new Date();

    // Generate unique QR code
    const qrPayload: BookingQRPayload = {
      user_firstname: user.firstname,
      user_secondname: user.secondname,
      booking_cost: priceDetails.total_cost,
      booking_seats: seats,
      created: creationDate,
      route_code: flight.route_code,
      terminal_gate: generateRandomGate(),
    };
    const qrBuffer = await generateQRCodeImageBuffer(
      getPayloadString(qrPayload),
      16
    );

    // Save QR Code buffer to file
    const filename = saveBufferToFile(
      qrBuffer,
      this.cfg.protected_files_path,
      "png"
    );
    const qrCodeURL = `http://${this.cfg.http_server.host}:${this.cfg.http_server.port}/upload/protected/${filename}`;

    try {
      // Create booking entry
      const bookingId = this.bookingRepo.add({
        user_id: user_id,
        flight_id: flight_id,
        baggage_weight: baggage_weight,
        qr_code: qrCodeURL,
        created: creationDate,
        seats,
        cost: priceDetails.total_cost,
      });

      // Invalidate user cache
      await this.bookingCache.invalidate(user_id);

      // Update flight.seats_available count
      await this.flightService.updateGeneral(flight_id, {
        seats_available: flight.seats_available - seats,
      });

      // NOTE: $$$ here we can write off funds from user

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
  public async getUserBookings(
    userID: number
  ): Promise<BookingDTO[]> {
    // Check existence of data in cache
    const bookingsCached = await this.bookingCache.getByUser(userID);
    if (!bookingsCached) {
      const bookings = this.bookingRepo.getDTOByUserID(userID);
      if (bookings)
        await this.bookingCache.setForUser(userID, bookings);
      return bookings ?? [];
    }
    return bookingsCached;
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
  public async updateBookingStatus(
    userId: number,
    userRole: Roles,
    bookingId: number,
    status: BookingStatus
  ): Promise<void> {
    try {
      const booking = AccessControl.checkAccess<BookingEntry>(
        userId,
        userRole,
        this.cfg.min_required_role,
        bookingId,
        (id) => this.bookingRepo.getByID(id)
      ) as BookingEntry;

      if (booking.status) {
        if (
          [BookingStatus.CANCELLED, BookingStatus.COMPLETED].includes(
            booking.status
          )
        ) {
          throw new ForbiddenError("not allowed action");
        } else if (
          booking.status == "ACTIVE" &&
          status == "CANCELLED"
        ) {
          console.log(`refund to the client id = ${booking.user_id}`);
        }
      }

      this.bookingRepo.updateStatus(bookingId, status);
      await this.bookingCache.invalidate(userId);
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
  public async deleteBooking(
    bookingId: number,
    userId: number,
    userRole: Roles
  ): Promise<void> {
    AccessControl.checkAccess<BookingEntry>(
      userId,
      userRole,
      this.cfg.min_required_role,
      bookingId,
      (id) => this.bookingRepo.getByID(id)
    );

    this.bookingRepo.removeByID(bookingId);
    await this.bookingCache.invalidate(bookingId);
  }

  public async getTrending(
    limit: number
  ): Promise<TrandingBookingsDTO[]> {
    const trandingBookingsCached =
      await this.bookingCache.getTranding();
    if (!trandingBookingsCached) {
      const trandingBookings = this.bookingRepo.getTrending(limit);
      if (!trandingBookings) {
        return [];
      }
      await this.bookingCache.setTranding(trandingBookings);
      return trandingBookings;
    }
    return trandingBookingsCached?.slice(0, limit);
  }

  public completeExpired(): number {
    const changes = this.bookingRepo.completeExpired(
      BookingStatus.COMPLETED
    );
    return changes;
  }
}
