import { Storage } from "./lib/repository/storage";
import { UserRepository } from "./repository/user.repository";
import { PaymentRepository } from "./repository/payment.repository";
import { FlightRepository } from "./repository/flight.repository";
import { CityRepository } from "./repository/city.repository";
import { CompanyRepository } from "./repository/company.repository";
import { AirportRepository } from "./repository/airport.repository";
import { BaggageRuleRepository } from "./repository/baggage-rule.repository";
import { BookingRepository } from "./repository/booking.repository";
import { DiscountRepository } from "./repository/discount.repository";

export function initStorage(storagePath: string): any {
	// Connect to storage
	const storage: Storage = new Storage(storagePath);
	console.log("storage loaded from path:", storagePath);

	// Create storage repositories
	const userRepo = new UserRepository(storage);
	const paymentRepo = new PaymentRepository(storage);
	const cityRepo = new CityRepository(storage);
	const airportRepo = new AirportRepository(storage);
	const baggageRuleRepo = new BaggageRuleRepository(storage);
	const companyRepo = new CompanyRepository(storage);
	const flightRepo = new FlightRepository(storage);
	const discountRepo = new DiscountRepository(storage);
	const bookingRepo = new BookingRepository(storage);
	return {
		storage,
		repositories: {
			userRepo,
			paymentRepo,
			cityRepo,
			airportRepo,
			baggageRuleRepo,
			companyRepo,
			flightRepo,
			discountRepo,
			bookingRepo,
		},
	};
}

export type Repositories = ReturnType<typeof initStorage>["repositories"];