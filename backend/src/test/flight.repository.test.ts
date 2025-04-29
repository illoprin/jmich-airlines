import { Storage } from "../lib/repository/storage";
import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import { AirportRepository } from "../repository/airport.repository";
import { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import { CityRepository } from "../repository/city.repository";
import { CompanyRepository } from "../repository/company.repository";
import { FlightRepository } from "../repository/flight.repository";
import { FlightStatus, type FlightEntry } from "../types/flight.type";
import {
	mockAirports,
	mockBaggageRules,
	mockCities,
	mockCompanies,
	DAY_MILLISECONDS,
	getMockFlight,
	HOUR_MILLISECONDS,
} from "./mock/mock.data";

describe("flight.repository", () => {
	let storage: Storage;
	let flightRepo: FlightRepository;
	let airportRepo: AirportRepository;

	beforeAll(() => {
		storage = new Storage(":memory:");

		// Create repositories
		const cityRepo = new CityRepository(storage);
		airportRepo = new AirportRepository(storage);
		const baggageRuleRepo = new BaggageRuleRepository(storage);
		const companyRepo = new CompanyRepository(storage);

		flightRepo = new FlightRepository(storage);

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
	});

	afterAll(() => {
		storage.close();
	});

	// Test: add valid entry
	it("add valid entry", () => {
		const flight: FlightEntry = {
			route_code: "L018",
			departure_airport_id: 1,
			arrival_airport_id: 4,
			departure_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 2 + DAY_MILLISECONDS
			),
			arrival_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 6 + DAY_MILLISECONDS
			),
			company_id: 3,
			seats_available: 67,
			price: 7834,
		};

		const id = flightRepo.add(flight);
		expect(id).toBeDefined();
	});

	// Test: add entry with unvalid date
	it("add entry with unvalid date", () => {
		const flight: FlightEntry = {
			route_code: "L058",
			departure_airport_id: 1,
			arrival_airport_id: 4,
			departure_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 2 - DAY_MILLISECONDS
			), // Yesterday
			arrival_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 6 - DAY_MILLISECONDS
			),
			company_id: 3,
			seats_available: 67,
			price: 7834,
		};

		try {
			flightRepo.add(flight);
		} catch (err) {
			expect(err).toBeInstanceOf(StorageError);
			expect((err as StorageError).type).toEqual(StorageErrorType.CHECK);
			expect((err as StorageError).field.includes("departure_date")).toEqual(
				true
			);
		}
	});

	// Test: add entry with unvalid route code
	it("add entry with unvalid route code", () => {
		const flight: FlightEntry = {
			route_code: "y01338",
			departure_airport_id: 1,
			arrival_airport_id: 4,
			departure_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 2 + DAY_MILLISECONDS
			), // Yesterday
			arrival_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 6 + DAY_MILLISECONDS
			),
			company_id: 3,
			seats_available: 67,
			price: 7834,
		};

		try {
			flightRepo.add(flight);
		} catch (err) {
			expect(err).toBeInstanceOf(StorageError);
			expect((err as StorageError).field.includes("route_code")).toEqual(true);
			expect((err as StorageError).type).toEqual(StorageErrorType.CHECK);
		}
	});

	// Test: add entries with simmilar route codes
	it("add entries with simmilar route codes", () => {
		const flight: FlightEntry = {
			route_code: "Y001",
			departure_airport_id: 1,
			arrival_airport_id: 4,
			departure_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 2 + DAY_MILLISECONDS
			), // Yesterday
			arrival_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 6 + DAY_MILLISECONDS
			),
			company_id: 3,
			seats_available: 67,
			price: 7834,
		};

		try {
			flightRepo.add(flight);
			flightRepo.add(flight);
		} catch (err) {
			expect(err).toBeInstanceOf(StorageError);
			expect((err as StorageError).type).toEqual(StorageErrorType.UNIQUE);
			expect((err as StorageError).field.includes("route_code")).toEqual(true);
		}
	});

	// Test: invalid foreign key
	it("add non-existent foreign key", () => {
		const flight: FlightEntry = {
			route_code: "U102",
			departure_airport_id: 1,
			arrival_airport_id: 20,
			departure_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 2 + DAY_MILLISECONDS
			), // Yesterday
			arrival_date: new Date(
				Date.now() + HOUR_MILLISECONDS * 6 + DAY_MILLISECONDS
			),
			company_id: 3,
			seats_available: 67,
			price: 7834,
		};

		try {
			flightRepo.add(flight);
		} catch (err) {
			expect(err).toBeInstanceOf(StorageError);
			expect((err as StorageError).type).toEqual(StorageErrorType.FOREIGN_KEY);
		}
	});

	// Test: delete related airport
	it("delete related airport", () => {
		try {
			airportRepo.removeByID(1);
		} catch (err) {
			expect(err).toBeInstanceOf(StorageError);
			expect((err as StorageError).type).toEqual(StorageErrorType.CHECK);
		}
		const flight = flightRepo.getByID(1);
		expect(flight).toBeDefined();
		if (flight) {
			expect(flight.arrival_airport_id).toBeDefined();
		}
	});

	// Test: update flight entry
	it("update flight entry", () => {
		const newAirport: number = 4;

		const flight = flightRepo.getByID(1);
		expect(flight).toBeDefined();

		if (flight) {
			flight.arrival_airport_id = 4;
			flight.departure_date = new Date(flight.departure_date);
			flight.arrival_date = new Date(flight.arrival_date);
			const changes = flightRepo.update(flight);
			expect(changes).toBeGreaterThan(0);
			const updatedFlight = flightRepo.getByID(1);
			expect(updatedFlight).toBeDefined();
			if (updatedFlight) {
				expect(updatedFlight.arrival_airport_id).toEqual(newAirport);
			}
		}
	});

	// Test: delete flight entry
	it("delete flight entry", () => {
		const flight = flightRepo.getByID(1);
		expect(flight).toBeDefined();
		if (flight) {
			const changes = flightRepo.removeByID(1);
			expect(changes).toBeGreaterThan(0);
		}
	});

	// Test: search flight with full query
	it("search flight full query", () => {
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
		flightRepo.add(flight);
		const flights = flightRepo.searchActiveFlights(
			3, // Пулково (СПб)
			1, // Шереметьево (Москва)
			undefined,
			10,
			0
		);

		expect(flights).toBeDefined();
		if (flights) {
			expect(flights.length).toBeGreaterThan(0);
		}
	});

	// Test: search flight with limited query
	it("search flight by departure date and departure airport", () => {
		const flight: FlightEntry = {
			departure_airport_id: 4,
			arrival_airport_id: 1,
			departure_date: new Date(Date.now() + DAY_MILLISECONDS),
			arrival_date: new Date(
				Date.now() + DAY_MILLISECONDS + HOUR_MILLISECONDS * 2.3
			),
			company_id: 4,
			price: 5000,
			route_code: "Z223",
			seats_available: 32,
			status: FlightStatus.ACTIVE,
		};
		flightRepo.add(flight);

		const departure_date = new Date(Date.now() + DAY_MILLISECONDS);
		const flights = flightRepo.searchActiveFlights(
			4,
			undefined,
			departure_date,
			undefined
		);
		expect(flights).toBeDefined();
		if (flights) {
			expect(flights.length).toBeGreaterThan(0);
		}
	});
});
