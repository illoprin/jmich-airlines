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
import { RedisClient } from "./redis/redis.client";
import { BookingCache } from "./redis/booking.cache";
import { FlightCache } from "./redis/flight.cache";
import { UserCache } from "./redis/user.cache";
import { CityCache } from "./redis/city.cache";

export function initStorage(storagePath: string, redisHost: string, redisPort: number): any {
	// Connect to storage
	const storage: Storage = new Storage(storagePath);
	console.log("storage loaded from path:", storagePath);

	// Connect to Redis server
	const redisClient = new RedisClient(
		redisHost, redisPort
	);

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

	// Create Redis repositories
	const bookingCache = new BookingCache(redisClient);
	const flightCache = new FlightCache(redisClient);
	const userCache = new UserCache(redisClient);
	const cityCache = new CityCache(redisClient);

	return {
		storage,
		redisClient,
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
			bookingCache,
			flightCache,
			userCache,
			cityCache
		},
	};
}

export type Repositories = ReturnType<typeof initStorage>["repositories"];