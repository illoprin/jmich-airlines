import { Storage } from "../lib/repository/storage";
import { AirportRepository } from "../repository/airport.repository";
import { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import { CityRepository } from "../repository/city.repository";
import { CompanyRepository } from "../repository/company.repository";
import { FlightRepository } from "../repository/flight.repository";
import { CityService } from "../service/city.service";
import { NotFoundError, NotUniqueError, RelatedDataError } from "../types/service.type";
import { mockAirports, mockBaggageRules, mockCities, mockCompanies } from "./mock/mock.data";
import { DAY_MILLISECONDS, HOUR_MILLISECONDS } from "../lib/service/const";

describe("city.service", () => {
	let storage: Storage;
	let cityService: CityService;

	beforeAll(() => {
		storage = new Storage(":memory:");

		const baggageRuleRepo = new BaggageRuleRepository(storage);
		const companyRepo = new CompanyRepository(storage);
		const cityRepo = new CityRepository(storage);
		const airportRepo = new AirportRepository(storage);
		const flightRepo = new FlightRepository(storage);

		// Add mock companies 
		mockBaggageRules.map(company => baggageRuleRepo.add(company));
		mockCompanies.map(company => companyRepo.add(company));

		cityService = new CityService(cityRepo, airportRepo);

		mockCities.map(city => cityRepo.add(city));
		airportRepo.add(mockAirports[0]);
		airportRepo.add(mockAirports[1]);
		airportRepo.add(mockAirports[2]);

		flightRepo.add({
			departure_airport_id: 1,
			arrival_airport_id: 3,
			departure_date: new Date(Date.now() + DAY_MILLISECONDS),
			arrival_date: new Date(Date.now() + DAY_MILLISECONDS + HOUR_MILLISECONDS * 2),
			company_id: 1,
			price: 4000,
			route_code: "B745",
			seats_available: 32,
		});
	});

	afterAll(() => {
		storage.close()
	});

	describe("deleteAirportByID", () => {
		it("should throw RelatedDataError", () => {
			try {
				cityService.removeCityAirportByCodeAndCityID(1, "SVO");
			} catch(err) {
				expect(err).toBeInstanceOf(RelatedDataError);
			}
		});
		it("should throw NotFoundError", () => {
			try {
				cityService.removeCityAirportByCodeAndCityID(1, "XXX");
			} catch(err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});
	});

	describe("addAirport", () => {
		it("should throw NotUniqueError", () => {
			try {
				cityService.addAirport(mockAirports[0]);
			} catch(err) {
				expect(err).toBeInstanceOf(NotUniqueError);
			}
		});
	});

	describe("addCity", () => {
		it("should throw NotUniqueError", () => {
			try {
				cityService.addCity(mockCities[0]);
			} catch(err) {
				expect(err).toBeInstanceOf(NotUniqueError);
			}
		});
	});

	describe("getCityDTO", () => {
		it("should return city dto correctly", () => {
			const city = cityService.getCityByID(1);

			expect(city.name).toBe(mockCities[0].name);
			expect(city.image).toBe(mockCities[0].image);
		});
	});

	describe("getAllCitiesDTO", () => {
		it("should return city dtos correctly", () => {
			const cities = cityService.getAllCities();
			expect(cities.length).toBe(mockCities.length);
		});
	});
	describe("updateCity", () => {
		it("should throw NotUniqueError", () => {
			try {
				cityService.updateCityByID(1, {name: mockCities[0].name});
			} catch(err) {
				expect(err).toBeInstanceOf(NotUniqueError);
			}
		});
		it("should throw NotFoundError", () => {
			try {
				cityService.updateCityByID(999, {name: mockCities[0].name});
			} catch(err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});
	});

	describe("updateAirport", () => {
		it("should throw NotUniqueError", () => {
			try {
				cityService.updateAirportByCodeAndCityID(1, "SVO", {name: mockAirports[0].name});
			} catch(err) {
				expect(err).toBeInstanceOf(NotUniqueError);
			}
		});
		it("should throw RelatedDataError", () => {
			try {
				cityService.updateAirportByCodeAndCityID(999, "SVO", {name: mockAirports[0].name});
			} catch(err) {
				expect(err).toBeInstanceOf(RelatedDataError);
			}
		});
		it("should throw NotFoundError", () => {
			try {
				cityService.updateAirportByCodeAndCityID(1, "UUI", {name: mockAirports[0].name});
			} catch(err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}
		});
	});
	
	describe("deleteCityByID", () => {
		it("should throw RelatedDataError", () => {
			try {
				cityService.removeCityByID(1);
			} catch(err) {
				expect(err).toBeInstanceOf(RelatedDataError);
			}
		});
	})
})