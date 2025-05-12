import { faker } from "@faker-js/faker/locale/ru";
import { Storage } from "../lib/repository/storage";
import { AirportRepository } from "../repository/airport.repository";
import { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import { CityRepository } from "../repository/city.repository";
import { CompanyRepository } from "../repository/company.repository";
import { FlightRepository } from "../repository/flight.repository";
import { UserRepository } from "../repository/user.repository";
import { BookingEntry, BookingStatus } from "../types/booking.type";
import {
  getMockFlight,
  getMockUser,
  mockAirports,
  mockBaggageRules,
  mockCities,
  mockCompanies,
} from "./mock/mock.data";
import { BookingRepository } from "../repository/booking.repository";
import {
  StorageError,
  StorageErrorType,
} from "../lib/repository/storage-error";

describe("booking.repository", () => {
  let storage: Storage;
  let bookingRepo: BookingRepository;

  const USERS_COUNT: number = 5;

  beforeAll(() => {
    storage = new Storage(":memory:");

    // Create repositories
    const cityRepo = new CityRepository(storage);
    const airportRepo = new AirportRepository(storage);
    const baggageRuleRepo = new BaggageRuleRepository(storage);
    const companyRepo = new CompanyRepository(storage);
    const userRepo = new UserRepository(storage);
    const flightRepo = new FlightRepository(storage);

    bookingRepo = new BookingRepository(storage);

    // Add mock data
    mockCities.map((city) => {
      cityRepo.add(city);
    });
    mockAirports.map((airport) => {
      airportRepo.add(airport);
    });
    mockBaggageRules.map((baggageRule) => {
      baggageRuleRepo.add(baggageRule);
    });
    mockCompanies.map((company) => {
      companyRepo.add(company);
    });
    for (let i = 0; i < 5; i++) {
      flightRepo.add(getMockFlight(5));
    }
    for (let i = 0; i < 5; i++) {
      userRepo.add(getMockUser());
    }
  });

  afterAll(() => {
    storage.close();
  });

  it("should add booking correctly", () => {
    const userId = 1;
    const flightId = 1;
    const baggageWeight = 10;
    const cost = 5000;
    const qrCode = "test-qr-code";

    const lastID = bookingRepo.add({
      user_id: userId,
      flight_id: flightId,
      baggage_weight: baggageWeight,
      seats: 1,
      created: new Date(),
      cost: cost,
      qr_code: qrCode,
    });

    expect(lastID).toBeGreaterThan(0);

    const booking = bookingRepo.getByID(Number(lastID));
    expect(booking).toBeDefined();
    expect(booking?.user_id).toBe(userId);
    expect(booking?.flight_id).toBe(flightId);
    expect(booking?.baggage_weight).toBe(baggageWeight);
    expect(booking?.cost).toBe(cost);
    expect(booking?.qr_code).toBe(qrCode);
  });

  it("should return bookings by user ID", () => {
    const userId = 1;
    const bookings = bookingRepo.getByUserID(userId);
    expect(bookings).toBeDefined();
    expect(bookings?.length).toBeGreaterThan(0);
    expect(bookings?.every((b) => b.user_id === userId)).toBeTruthy();
  });

  it("should return bookings by flight ID", () => {
    const flightId = 1;
    const bookings = bookingRepo.getByFlightID(flightId);
    expect(bookings).toBeDefined();
    if (bookings) {
      expect(bookings.length).toBeGreaterThan(0);
      expect(bookings.every((b) => b.flight_id === flightId)).toBeTruthy();
    }
  });

  it("should return BookingDTO by ID with correct structure", () => {
    const bookingId = 1;
    const dto = bookingRepo.getDTOByID(bookingId);

    expect(dto).toBeDefined();
    if (dto) {
      // Check basic fields
      expect(dto.id).toBe(bookingId);
      expect(dto.user_id).toBeDefined();
      expect(dto.baggage_weight).toBeDefined();
      expect(dto.cost).toBeDefined();
      expect(dto.qr_code).toBeDefined();
      expect(dto.created).toBeDefined();
      expect(dto.status).toBeDefined();

      // Check flight DTO structure
      expect(dto.flight).toBeDefined();
      expect(dto.flight.route_code).toBeDefined();
      expect(dto.flight.departure_date).toBeDefined();
      expect(dto.flight.arrival_date).toBeDefined();
      expect(dto.flight.price).toBeDefined();
      expect(dto.flight.status).toBeDefined();
      expect(dto.flight.seats_available).toBeDefined();

      // Check company structure
      expect(dto.flight.company).toBeDefined();
      expect(dto.flight.company.name).toBeDefined();
      expect(dto.flight.company.logo).toBeDefined();
      expect(dto.flight.company.baggage_rule).toBeDefined();

      if (dto.flight.company.baggage_rule) {
        expect(dto.flight.company.baggage_rule.max_free_weight).toBeDefined();
        expect(dto.flight.company.baggage_rule.price_per_kg).toBeDefined();
      }

      // Check cities structure
      expect(dto.flight.departure_city).toBeDefined();
      expect(dto.flight.departure_city.name).toBeDefined();
      expect(dto.flight.departure_city.image).toBeDefined();
      expect(dto.flight.departure_city.airport).toBeDefined();
      expect(dto.flight.departure_city.airport.name).toBeDefined();
      expect(dto.flight.departure_city.airport.code).toBeDefined();

      expect(dto.flight.arrival_city).toBeDefined();
      expect(dto.flight.arrival_city.name).toBeDefined();
      expect(dto.flight.arrival_city.image).toBeDefined();
      expect(dto.flight.arrival_city.airport).toBeDefined();
      expect(dto.flight.arrival_city.airport.name).toBeDefined();
      expect(dto.flight.arrival_city.airport.code).toBeDefined();
    }
  });

  it("should return BookingDTOs by user ID with correct structure", () => {
    const userId = 1;
    const dtos = bookingRepo.getDTOByUserID(userId);

    expect(dtos).toBeDefined();
    expect(dtos?.length).toBeGreaterThan(0);

    if (dtos) {
      dtos.forEach((dto) => {
        expect(dto.user_id).toBe(userId);
        expect(dto.flight).toBeDefined();
        // Можно добавить более детальные проверки структуры, как в предыдущем тесте
      });
    }
  });

  it("should return all BookingDTOs with pagination", () => {
    const limit = 5;
    const page = 0;
    const dtos = bookingRepo.getDTOAll(limit, page);

    expect(dtos).toBeDefined();
    expect(dtos?.length).toBeLessThanOrEqual(limit);

    if (dtos) {
      dtos.forEach((dto) => {
        expect(dto).toBeDefined();
        expect(dto.flight).toBeDefined();
      });
    }
  });

  it("should return null for non-existent booking ID", () => {
    const nonExistentId = 9999;
    const dto = bookingRepo.getDTOByID(nonExistentId);
    expect(dto).toBeNull();
  });

  it("should handle null flight_id correctly", () => {
    // Добавляем бронирование без flight_id
    const booking: BookingEntry = {
      user_id: 1,
      baggage_weight: 10,
      seats: 1,
      created: new Date(),
      cost: 5000,
      qr_code: "test-null-flight",
    };
    try {
      bookingRepo.add(booking);
      expect(bookingRepo.add(booking)).toThrow(StorageError);
    } catch (err) {
      expect(err).toBeInstanceOf(StorageError);
      expect((err as StorageError).type).toEqual(StorageErrorType.CHECK);
    }
  });

  it("should update booking status correctly", () => {
    // Добавляем корректное бронирование
    const booking: BookingEntry = {
      flight_id: 3,
      user_id: 1,
      seats: 1,
      created: new Date(),
      baggage_weight: 10,
      cost: 5000,
      qr_code: "test-null-flight",
    };

    // Add booking to repo
    const lastID = Number(bookingRepo.add(booking));
    expect(lastID).toBeGreaterThan(0);

    // Update booking status
    const changes = bookingRepo.updateStatus(lastID, BookingStatus.CANCELLED);
    expect(changes).toBe(1);

    // Check status field in entry
    const bookingDTO = bookingRepo.getDTOByID(lastID);
    expect(bookingDTO).toBeDefined();

    if (bookingDTO) {
      expect(bookingDTO.status).toEqual(BookingStatus.CANCELLED);
    }
  });
});
