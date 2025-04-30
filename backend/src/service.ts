import { Config } from "./types/config.type";
import { Repositories } from "./storage";
import { UserService } from "./service/user.service";
import { FlightService } from "./service/flight.service";
import { BookingService } from "./service/booking.service";
import { CompanyService } from "./service/company.service";
import { CityService } from "./service/city.service";
import { DiscountService } from "./service/discount.service";

export function initServices (repositories: Repositories, cfg: Config) {
	return {
		userService: new UserService(
			repositories.userRepo,
			repositories.paymentRepo,
			cfg
		),
		flightService: new FlightService(repositories.flightRepo),
		bookingService: new BookingService(
			repositories.bookingRepo,
			repositories.discountRepo,
			repositories.flightRepo,
			repositories.userRepo,
			repositories.companyRepo,
			cfg
		),
		companyService: new CompanyService(
			repositories.companyRepo,
			repositories.baggageRuleRepo
		),
		cityService: new CityService(
			repositories.cityRepo,
			repositories.airportRepo
		),
		discountService: new DiscountService(repositories.discountRepo),
		cfg
	};
};

export type Services = ReturnType<typeof initServices>;
export type Dependencies = ReturnType<typeof initServices>;
