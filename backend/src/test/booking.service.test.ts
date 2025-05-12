import { ExpressValidator } from "express-validator";
import { Storage } from "../lib/repository/storage";
import { randomID } from "../lib/service/random";
import { AirportRepository } from "../repository/airport.repository";
import { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import { BookingRepository } from "../repository/booking.repository";
import { CityRepository } from "../repository/city.repository";
import { CompanyRepository } from "../repository/company.repository";
import { DiscountRepository } from "../repository/discount.repository";
import { FlightRepository } from "../repository/flight.repository";
import { UserRepository } from "../repository/user.repository";
import { BookingService } from "../service/booking.service";
import {
  ForbiddenError,
  InvalidFieldError,
  NotFoundError,
  RelatedDataError,
} from "../types/service.type";
import { Roles } from "../types/user.type";
import {
  getMockBooking,
  getMockDiscount,
  getMockFlight,
  getMockUser,
  mockAirports,
  mockBaggageRules,
  mockCities,
  mockCompanies,
} from "./mock/mock.data";
import { BookingStatus } from "../types/booking.type";

describe("booking.service", () => {
  const usersCount = 3;
  const flightsCount = 5;
  const cfg = {
    booking_files_path: "upload/protected/booking",
    min_required_role: 3,
    http_server: {
      host: "localhost",
      port: 8000,
    },
  };

  let storage: Storage;
  let bookingRepo: BookingRepository;
  let bookingService: BookingService;
  let discountRepo: DiscountRepository;
  let flightRepo: FlightRepository;

  let validDiscountId: number;
  let invalidDiscountId: number;
  let moderatorID: number;
  let adminID: number;
  let userID: number;

  beforeAll(() => {
    storage = new Storage(":memory:");

    // Create repositories
    const cityRepo = new CityRepository(storage);
    const airportRepo = new AirportRepository(storage);
    const baggageRuleRepo = new BaggageRuleRepository(storage);
    const companyRepo = new CompanyRepository(storage);
    const userRepo = new UserRepository(storage);
    discountRepo = new DiscountRepository(storage);
    bookingRepo = new BookingRepository(storage);
    flightRepo = new FlightRepository(storage);

    // Create service
    bookingService = new BookingService(
      bookingRepo,
      discountRepo,
      flightRepo,
      userRepo,
      companyRepo,
      cfg as any,
    );

    // Fill db with mock data
    mockCities.map((city) => cityRepo.add(city));
    mockAirports.map((airport) => airportRepo.add(airport));
    mockBaggageRules.map((rule) => baggageRuleRepo.add(rule));
    mockCompanies.map((company) => companyRepo.add(company));
    userID = Number(userRepo.add(getMockUser(Roles.Customer)));
    adminID = Number(userRepo.add(getMockUser(Roles.Admin)));
    moderatorID = Number(userRepo.add(getMockUser(Roles.Moderator)));
    for (let i = 0; i < flightsCount; i++) {
      flightRepo.add(getMockFlight(5));
    }
    validDiscountId = Number(discountRepo.add(getMockDiscount(10, true)));
    invalidDiscountId = Number(discountRepo.add(getMockDiscount(10, true)));
  });

  afterEach(() => {
    storage.run(`DELETE FROM ${bookingRepo.getTableName()}`, []);
  });

  afterAll(() => {
    storage.close();
  });

  describe("createBooking", () => {
    it("should create valid booking without discount", async () => {
      // PERF

      const flight_id = randomID(flightsCount);
      const user_id = randomID(usersCount);
      const seats = 3;

      // Check flight seats before booking
      const flight_seats = flightRepo.getByID(flight_id)?.seats_available;
      console.log("flight seats:", flight_seats);

      // Add booking
      const id = Number(await bookingService.add(user_id, flight_id, seats, 5));

      const booking = bookingRepo.getByID(id);
      // Validate booiking fields
      expect(booking).toBeDefined();
      expect(booking?.user_id).toEqual(user_id);
      expect(booking?.flight_id).toEqual(flight_id);
      expect(booking?.seats).toEqual(seats);
      expect(booking?.baggage_weight).toEqual(5);
      expect(booking?.qr_code).toBeDefined();
      if (booking) {
        expect(new Date(booking.created).getMilliseconds()! < Date.now()).toBe(
          true,
        );
      }

      // Check flight seats after booking
      expect(flightRepo.getByID(flight_id)?.seats_available).toEqual(
        (flight_seats as number) - seats,
      );
    });

    it("should create valid booking", async () => {
      // PERF
      const user_id = randomID(usersCount);
      const flight_id = randomID(flightsCount);
      const code = discountRepo.getByID(validDiscountId)?.code;
      const id = Number(
        await bookingService.add(user_id, flight_id, 1, 5, code),
      );

      const booking = bookingRepo.getByID(id);
      expect(booking).toBeDefined();
      expect(booking?.user_id).toEqual(user_id);
      expect(booking?.flight_id).toEqual(flight_id);
      expect(booking?.seats).toEqual(1);
      expect(booking?.baggage_weight).toEqual(5);
      expect(booking?.qr_code).toBeDefined();
      if (booking) {
        expect(new Date(booking.created).getMilliseconds()! < Date.now()).toBe(
          true,
        );
      }
    });

    it("should throw RelatedDataError", async () => {
      // PERF
      const flight_id = randomID(flightsCount);
      const code = discountRepo.getByID(validDiscountId)?.code;
      try {
        await bookingService.add(999, flight_id, 1, 5, code);
      } catch (err) {
        expect(err).toBeInstanceOf(RelatedDataError);
      }
    });
    it("should throw RelatedDataError", async () => {
      // PERF
      const user_id = randomID(usersCount);
      const code = discountRepo.getByID(validDiscountId)?.code;
      try {
        await bookingService.add(user_id, 999, 1, 5, code);
      } catch (err) {
        expect(err).toBeInstanceOf(RelatedDataError);
      }
    });

    it("invalid code, should throw InvalidFieldError", async () => {
      // PERF
      const user_id = randomID(usersCount);
      const flight_id = randomID(flightsCount);
      try {
        await bookingService.add(user_id, flight_id, 1, 5, "invalid_code");
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect((err as InvalidFieldError).message.includes("code")).toBe(true);
      }
    });
    it("expired code, should throw InvalidFieldError", async () => {
      // PERF
      const user_id = randomID(usersCount);
      const flight_id = randomID(flightsCount);
      const code = discountRepo.getByID(invalidDiscountId)?.code;
      try {
        await bookingService.add(user_id, flight_id, 1, 5, code);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect((err as InvalidFieldError).message.includes("code")).toBe(true);
      }
    });
    it("seats <= 0 && baggageWeight <= 0", async () => {
      // PERF
      const user_id = randomID(usersCount);
      const flight_id = randomID(flightsCount);

      try {
        await bookingService.add(user_id, flight_id, -4, 5);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect((err as InvalidFieldError).message.includes("seats")).toBe(true);
      }

      try {
        await bookingService.add(user_id, flight_id, 0, 5);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect((err as InvalidFieldError).message.includes("seats")).toBe(true);
      }

      try {
        await bookingService.add(user_id, flight_id, 1, -2);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidFieldError);
        expect((err as InvalidFieldError).message.includes("baggage")).toBe(
          true,
        );
      }
    });
  });

  describe("getBooking", () => {
    it("should return booking correctly", async () => {
      // PERF

      // Create new booking
      const flight_id = randomID(flightsCount);
      const user_id = userID;
      const seats = 3;
      const id = Number(await bookingService.add(user_id, flight_id, seats, 5));

      try {
        const booking = bookingService.getBookingById(
          userID,
          Roles.Customer,
          id,
        );
        console.log(booking);
        expect(booking).toBeDefined();
        expect(booking.flight).toBeDefined();
        expect(booking.flight.departure_city).toBeDefined();
        expect(booking.flight.departure_city.airport).toBeDefined();
        expect(booking.flight.arrival_city).toBeDefined();
        expect(booking.flight.arrival_city.airport).toBeDefined();
        expect(booking.flight.company).toBeDefined();
        expect(booking.flight.company.baggage_rule).toBeDefined();
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
    it("should prevent access for user moderator but not for admin", async () => {
      // PERF

      // Create new booking
      const flight_id = randomID(flightsCount);
      const user_id = userID;
      const seats = 3;
      const id = Number(await bookingService.add(user_id, flight_id, seats, 5));

      try {
        bookingService.getBookingById(2, Roles.Customer, id);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
      }
      try {
        bookingService.getBookingById(moderatorID, Roles.Moderator, id);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
      }
      try {
        bookingService.getBookingById(adminID, Roles.Admin, id);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
    it("should return not found error", async () => {
      // PERF
      try {
        bookingService.getBookingById(2, Roles.Customer, 999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe("getUserBookings", () => {
    it("should properly return all bookings", async () => {
      // PERF
      let ids: number[] = [];
      const booking_count = 5;

      for (let i = 0; i < booking_count; i++) {
        const flight_id = randomID(flightsCount);
        const seats = 1;
        const booking_id = await bookingService.add(
          userID,
          flight_id,
          seats,
          5,
        );
        ids.push(Number(booking_id));
      }
      const bookings = bookingService.getUserBookings(userID);

      expect(bookings.length).toEqual(booking_count);
      for (const booking of bookings) {
        expect(ids.includes(booking.id as number)).toBe(true);
      }
    }, 10_000);
    it("should return empty array", async () => {
      // PERF
      const bookings = bookingService.getUserBookings(777);
      expect(bookings.length).toBe(0);
    });
  });

  describe("getAllBookings", () => {
    it("should return paginated entries properly", () => {
      // PERF
      const booking_count = 10;
      for (let i = 0; i < booking_count; i++) {
        const id = bookingRepo.add(
          getMockBooking(
            usersCount,
            flightsCount,
            { max: 20, min: 10 },
            { min: 3000, max: 20_000 },
          ),
        );
        console.log(id);
      }

      const bookings = bookingService.getAllBookings(5, 0);
      expect(bookings.length).toBe(5);

      const bookings_2 = bookingService.getAllBookings(5, 1);
      console.log(bookings_2);
      expect(bookings_2.length).toBe(5);
    }, 10_000);
  });

  describe("updateBookingStatus", () => {
    it("should update status currectly", async () => {
      // PERF
      const flight_id = randomID(flightsCount);
      const seats = 1;
      const booking_id = Number(
        await bookingService.add(userID, flight_id, seats, 5),
      );

      bookingService.updateBookingStatus(
        userID,
        Roles.Customer,
        booking_id,
        BookingStatus.CANCELLED,
      );

      const bookingCancelled = bookingRepo.getByID(booking_id);
      expect(bookingCancelled).toBeDefined();
      expect(bookingCancelled?.status).toBe(BookingStatus.CANCELLED);

      bookingService.updateBookingStatus(
        adminID,
        Roles.Admin,
        booking_id,
        BookingStatus.ACTIVE,
      );

      const bookingActive = bookingRepo.getByID(booking_id);
      expect(bookingActive).toBeDefined();
      expect(bookingActive?.status).toBe(BookingStatus.ACTIVE);
    });

    it("should throw InvalidFieldError", async () => {
      // PERF
      const flight_id = randomID(flightsCount);
      const seats = 1;
      const booking_id = Number(
        await bookingService.add(userID, flight_id, seats, 5),
      );

      try {
        bookingService.updateBookingStatus(
          userID,
          Roles.Customer,
          booking_id,
          "invalid_status" as any,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidFieldError);
      }
    });

    it("should throw ForbiddedError", async () => {
      // PERF
      const flight_id = randomID(flightsCount);
      const seats = 1;
      const booking_id = Number(
        await bookingService.add(userID, flight_id, seats, 5),
      );

      try {
        bookingService.updateBookingStatus(
          moderatorID,
          Roles.Moderator,
          booking_id,
          BookingStatus.CANCELLED,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
      }
    });
  });
  describe("deleteBooking", () => {
    it("should delete correctly", async () => {
      // PERF
      const flight_id = randomID(flightsCount);
      const seats = 1;
      let booking_id = Number(
        await bookingService.add(userID, flight_id, seats, 5),
      );

      bookingService.deleteBooking(booking_id, userID, Roles.Customer);

      expect(bookingRepo.getByID(booking_id)).toBe(null);

      booking_id = Number(
        await bookingService.add(userID, flight_id, seats, 5),
      );

      bookingService.deleteBooking(booking_id, adminID, Roles.Admin);

      expect(bookingRepo.getByID(booking_id)).toBe(null);
    }, 10_000);
    it("should throw NotFoundError", async () => {
      // PERF
      try {
        bookingService.deleteBooking(999, userID, Roles.Customer);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
    it("should throw ForbiddedError", async () => {
      // PERF
      const flight_id = randomID(flightsCount);
      const seats = 1;
      const booking_id = Number(
        await bookingService.add(userID, flight_id, seats, 5),
      );

      try {
        bookingService.deleteBooking(booking_id, moderatorID, Roles.Moderator);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
      }
    });
  });
});
