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
    repositories.flightCache,
  );
  const userService = new UserService(
    repositories.userRepo,
    repositories.userCache,
    repositories.paymentRepo,
    cfg,
  );
  const likedFlightService = new LikedFlightService(
    repositories.likedFlightRepo,
    repositories.likedFlightCache,
    repositories.flightRepo,
  );
  const discountService = new DiscountService(repositories.discountRepo);
  const companyService = new CompanyService(
    repositories.companyRepo,
    repositories.baggageRuleRepo,
  );
  return {
    userService,
    flightService,
    notificationService: new NotificationService(repositories.notificationRepo),
    bookingService: new BookingService(
      repositories.bookingRepo,
      repositories.bookingCache,
      discountService,
      flightService,
      userService,
      companyService,
      repositories.paymentRepo,
      cfg,
    ),
    companyService,
    cityService: new CityService(
      repositories.cityRepo,
      repositories.cityCache,
      repositories.airportRepo,
    ),
    discountService,
    likedFlightService,
    cfg,
  };
}

export type Services = ReturnType<typeof initServices>;
export type Dependencies = ReturnType<typeof initServices>;
