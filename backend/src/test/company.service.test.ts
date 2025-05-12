import { Storage } from "../lib/repository/storage";
import { AirportRepository } from "../repository/airport.repository";
import { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import { CityRepository } from "../repository/city.repository";
import { CompanyRepository } from "../repository/company.repository";
import { FlightRepository } from "../repository/flight.repository";
import { CompanyService } from "../service/company.service";
import { NotUniqueError, RelatedDataError } from "../types/service.type";
import {
  getMockFlight,
  mockAirports,
  mockBaggageRules,
  mockCities,
  mockCompanies,
} from "./mock/mock.data";

describe("company.service", () => {
  let storage: Storage;
  let companyRepo: CompanyRepository;
  let baggageRuleRepo: BaggageRuleRepository;
  let companyService: CompanyService;
  let flightRepo: FlightRepository;

  beforeAll(() => {
    storage = new Storage(":memory:");

    companyRepo = new CompanyRepository(storage);
    baggageRuleRepo = new BaggageRuleRepository(storage);
    const cityRepo = new CityRepository(storage);
    const airportRepo = new AirportRepository(storage);
    mockCities.map((city) => cityRepo.add(city));
    mockAirports.map((airport) => airportRepo.add(airport));
    flightRepo = new FlightRepository(storage);

    companyService = new CompanyService(companyRepo, baggageRuleRepo);
  });

  afterEach(() => {
    storage.run(`DELETE FROM ${companyRepo.getTableName()}`, []);
    storage.run(`DELETE FROM ${baggageRuleRepo.getTableName()}`, []);
  });

  describe("addCompany", () => {
    it("should add and return correctly", () => {
      const brEntry = {
        max_free_weight: 10,
        price_per_kg: 2_000,
      };
      const cEntry = {
        name: "Аэрофлот",
        logo: ":logo:",
        baggage_rule_id: 1,
      };

      companyService.addBaggageRule(brEntry);

      companyService.addCompany(cEntry);

      const baggageRule = baggageRuleRepo.getByID(1);
      expect(baggageRule).toBeDefined();
      expect(baggageRule?.max_free_weight).toBe(brEntry.max_free_weight);
      expect(baggageRule?.price_per_kg).toBe(brEntry.price_per_kg);

      const company = companyService.getCompanyDTOByID(1);
      expect(company).toBeDefined();
      expect(company.baggage_rule.max_free_weight).toBe(
        brEntry.max_free_weight,
      );
      expect(company.baggage_rule.price_per_kg).toBe(brEntry.price_per_kg);
      expect(company.name).toBe(cEntry.name);
      expect(company.logo).toBe(cEntry.logo);
    });

    it("should throw NotUniqueError", () => {
      const brEntry = {
        max_free_weight: 10,
        price_per_kg: 2_000,
      };
      const cEntry = {
        name: "Аэрофлот",
        logo: ":logo:",
        baggage_rule_id: 1,
      };
      companyService.addBaggageRule(brEntry);
      companyService.addCompany(cEntry);

      try {
        companyService.addCompany(cEntry);
      } catch (err) {
        expect(err).toBeInstanceOf(NotUniqueError);
      }
    });
  });

  describe("removeCompanyByID", () => {
    it("should throw related data error", () => {
      mockBaggageRules.map((br) => companyService.addBaggageRule(br));
      mockCompanies.map((company) => companyService.addCompany(company));
      const flight = getMockFlight(5);

      try {
        companyService.removeCompanyByID(flight.company_id);
      } catch (err) {
        expect(err).toBeInstanceOf(RelatedDataError);
      }
    });
  });
});
