import { Storage } from "../lib/repository/storage";
import { FlightService } from "../service/flight.service";
import { FlightRepository } from "../repository/flight.repository";
import { CityRepository } from "../repository/city.repository";
import { AirportRepository } from "../repository/airport.repository";
import { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import { CompanyRepository } from "../repository/company.repository";
import {
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
	RelatedDataError,
} from "../types/service.type";
import { FlightDTO, FlightEntry, FlightStatus } from "../types/flight.type";
import {
	mockCities,
	mockAirports,
	mockBaggageRules,
	mockCompanies,
	getMockFlight,
	getMockUser,
} from "./mock/mock.data";
import { DAY_MILLISECONDS, HOUR_MILLISECONDS } from "../lib/service/const";
import { BookingRepository } from "../repository/booking.repository";
import { faker } from "@faker-js/faker/locale/ru";
import { UserRepository } from "../repository/user.repository";

describe("flight.service", () => {
	let storage: Storage;
	let flightService: FlightService;
	let flightRepo: FlightRepository;
	let bookingRepo: BookingRepository;

	beforeAll(() => {
		storage = new Storage(":memory:");

		// Create repositories
		const cityRepo = new CityRepository(storage);
		const airportRepo = new AirportRepository(storage);
		const baggageRuleRepo = new BaggageRuleRepository(storage);
		const companyRepo = new CompanyRepository(storage);
		const userRepo = new UserRepository(storage);
		bookingRepo = new BookingRepository(storage);
		flightRepo = new FlightRepository(storage);

		// Create service
		flightService = new FlightService(flightRepo);

		// Fill db with mock data
		mockCities.map((city) => cityRepo.add(city));
		mockAirports.map((airport) => airportRepo.add(airport));
		mockBaggageRules.map((rule) => baggageRuleRepo.add(rule));
		mockCompanies.map((company) => companyRepo.add(company));
		for (let i = 0; i < 3; i++) {
			userRepo.add(getMockUser());
		}
	});

	afterAll(() => {
		storage.close();
	});

	describe("add", () => {
		it("should add valid flight successfully", () => {
			const newFlight = {
				route_code: "S010",
				departure_airport_id: 1,
				arrival_airport_id: 2,
				departure_date: new Date(Date.now() + 86400000), // Tomorrow
				arrival_date: new Date(Date.now() + 86400000 * 2),
				company_id: 1,
				price: 15000,
				seats_available: 120,
				status: FlightStatus.ACTIVE,
			};

			const id = flightService.add(newFlight);
			expect(id).toBeGreaterThan(0);

			// Проверяем, что рейс действительно добавлен
			const addedFlight = flightRepo.getByID(Number(id));
			expect(addedFlight).toBeDefined();
			expect(addedFlight?.route_code).toBe(newFlight.route_code);
		});

		it("should throw InvalidFieldError for invalid route_code format", () => {
			const invalidFlight = {
				...getMockFlight(5),
				route_code: "invalid_code", // Неправильный формат
			};

			expect(() => flightService.add(invalidFlight)).toThrow(InvalidFieldError);
		});

		it("should throw NotUniqueError for duplicate route_code", () => {
			const duplicateFlight = getMockFlight(5);
			duplicateFlight.route_code = "S010";

			expect(() => flightService.add(duplicateFlight)).toThrow(NotUniqueError);
		});

		it("should throw InvalidFieldError for non-existent company", () => {
			const invalidFlight = {
				...getMockFlight(5),
				company_id: 999, // Несуществующая компания
			};

			expect(() => flightService.add(invalidFlight)).toThrow(InvalidFieldError);
		});
	});

	describe("getByID", () => {
		it("should return flight DTO for existing flight", () => {
			const addedFlight = getMockFlight(5);
			const addedID = flightService.add(addedFlight);
			const flight = flightService.getByID(Number(addedID));

			expect(flight).toBeDefined();
			expect(flight.id).toBe(addedID);
			expect(flight.route_code).toBe(addedFlight.route_code);
			expect(flight.departure_city).toBeDefined();
			expect(flight.arrival_city).toBeDefined();
			expect(flight.company).toBeDefined();
		});

		it("should throw NotFoundError for non-existent flight", () => {
			expect(() => flightService.getByID(999)).toThrow(NotFoundError);
		});
	});

	describe("updateGeneral", () => {
		it("should update flight data successfully", () => {
			const addedID = Number(flightRepo.add(getMockFlight(5)));
			const updates = {
				route_code: "T374",
				price: 20000,
			};

			flightService.updateGeneral(addedID, updates);

			const updatedFlight = flightRepo.getByID(addedID);
			expect(updatedFlight).toBeDefined();
			if (updatedFlight) {
				expect(updatedFlight.route_code).toEqual(updates.route_code);
				expect(updatedFlight.price).toEqual(updates.price);
			}
		});

		it("should throw NotFoundError for non-existent flight", () => {
			try {
				flightService.updateGeneral(999, { route_code: "E834" });
			} catch (err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});

		it("should throw InvalidFieldError for invalid update data", () => {
			try {
				flightService.updateGeneral(1, { route_code: "invalid_code" });
			} catch (err) {
				expect(err).toBeInstanceOf(InvalidFieldError);
			}
		});
	});

	describe("updateStatus", () => {
		it("should update flight status successfully", () => {
			flightService.updateStatus(1, FlightStatus.DELAYED);

			const updatedFlight = flightRepo.getByID(1);
			expect(updatedFlight?.status).toBe(FlightStatus.DELAYED);
		});

		it("should throw NotFoundError for non-existent flight", () => {
			expect(() =>
				flightService.updateStatus(999, FlightStatus.ACTIVE)
			).toThrow(NotFoundError);
		});

		it("should throw InvalidFieldError for invalid status", () => {
			expect(() => flightService.updateStatus(1, "INVALID" as any)).toThrow(
				InvalidFieldError
			);
		});
	});

	describe("search", () => {
		it("should find flights by departure and arrival airports", () => {
			const flight: FlightEntry = {
				departure_airport_id: 3,
				arrival_airport_id: 1,
				departure_date: new Date(Date.now() + DAY_MILLISECONDS),
				arrival_date: new Date(
					Date.now() + DAY_MILLISECONDS + HOUR_MILLISECONDS * 2.3
				),
				company_id: 4,
				price: 5000,
				route_code: "Y283",
				seats_available: 32,
				status: FlightStatus.ACTIVE,
			};
			flightService.add(flight);
			const results = flightService.search({
				departure_airport_id: 3, // Пулково (СПб)
				arrival_airport_id: 1, // Шереметьево (Москва)
				max: 10,
				page: 0,
			});

			expect(results.length).toBeGreaterThan(0);
			expect(results[0].departure_city.name).toMatch(/Санкт-Петербург/i);
			expect(results[0].arrival_city.name).toMatch(/Москва/i);
			expect(results[0].cheapest).toBe(true); // Должен быть помечен как самый дешевый
		});

		it("should throw InvalidFieldError for past departure date", () => {
			try {
				flightService.search({
					departure_date: new Date(Date.now() - DAY_MILLISECONDS), // Вчера
					max: 10,
					page: 0,
				});
			} catch (err) {
				expect(err).toBeInstanceOf(InvalidFieldError);
			}
		});

		it("should throw NotFoundError when no flights found", () => {
			try {
				flightService.search({
					departure_airport_id: 3,
					arrival_airport_id: 3,
					max: 10,
					page: 0,
				});
			} catch (err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});
	});

	describe("deltaSeats", () => {
		it("should update seats count correctly", () => {
			const initialSeats = flightRepo.getByID(1)?.seats_available || 0;
			const delta = -2;

			flightService.deltaSeats(1, delta);

			const updatedFlight = flightRepo.getByID(1);
			expect(updatedFlight?.seats_available).toBe(initialSeats + delta);
		});

		it("should throw NotFoundError for non-existent flight", () => {
			expect(() => flightService.deltaSeats(999, -1)).toThrow(NotFoundError);
		});
	});

	describe("removeByID", () => {
		it("should delete flight successfully", () => {
			const id = flightRepo.add(getMockFlight(3));

			flightService.removeByID(Number(id));

			try {
				flightService.getByID(Number(id));
			} catch (err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});

		it("should throw NotFoundError for non-existent flight", () => {
			try {
				flightService.removeByID(999);
			} catch (err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});

		it("should throw RelatedDataError when flight has linked booking", () => {
			// Add new booking with flight_id = 1
			bookingRepo.add({
				flight_id: 1,
				user_id: 1,
				baggage_weight: 10,
				created: new Date(),
				seats: 1,
				cost: 1000,
				qr_code: faker.internet.url(),
			});
			// Delete flight
			try {
				flightService.removeByID(1);
			} catch (err) {
				expect(err).toBeInstanceOf(RelatedDataError);
			}
		});
	});
});
