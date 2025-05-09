import { Config } from "./types/internal/config";
import { Repositories } from "./storage";
import { UserService } from "./service/user.service";
import { FlightService } from "./service/flight.service";
import { BookingService } from "./service/booking.service";
import { CompanyService } from "./service/company.service";
import { CityService } from "./service/city.service";
import { DiscountService } from "./service/discount.service";
import { NotificationService } from "./service/notification.service";
import { LikedFlightService } from "./service/liked-flight.service";

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
	const likedFlightService = new LikedFlightService(
		repositories.likedFlightRepo,
		repositories.likedFlightCache,
		repositories.flightRepo
	);
	return {
		userService,
		flightService,
		notificationService: new NotificationService(repositories.notificationRepo),
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
		likedFlightService,
		cfg,
	};
}

export type Services = ReturnType<typeof initServices>;
export type Dependencies = ReturnType<typeof initServices>;
