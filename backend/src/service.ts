import { Config } from "./types/config.type";
import { Repositories } from "./storage";
import { UserService } from "./service/user.service";
import { FlightService } from "./service/flight.service";
import { BookingService } from "./service/booking.service";
import { CompanyService } from "./service/company.service";
import { CityService } from "./service/city.service";
import { DiscountService } from "./service/discount.service";

export function initServices(repositories: Repositories, cfg: Config) {
	const flightService = new FlightService(
		repositories.flightRepo,
		repositories.flightCache
	);
	const userService = new UserService(
		repositories.userRepo,
		repositories.userCache,
		repositories.paymentRepo,
		cfg
	);
	return {
		userService,
		flightService,
		bookingService: new BookingService(
			repositories.bookingRepo,
			repositories.bookingCache,
			repositories.discountRepo,
			flightService,
			userService,
			repositories.companyRepo,
			repositories.paymentRepo,
			cfg
		),
		companyService: new CompanyService(
			repositories.companyRepo,
			repositories.baggageRuleRepo
		),
		cityService: new CityService(
			repositories.cityRepo,
			repositories.cityCache,
			repositories.airportRepo
		),
		discountService: new DiscountService(repositories.discountRepo),
		cfg,
	};
}

export type Services = ReturnType<typeof initServices>;
export type Dependencies = ReturnType<typeof initServices>;
