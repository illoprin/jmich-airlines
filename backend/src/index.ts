import express, { Router } from "express";
import { readConfig } from "./config/config";
import { Storage } from "./lib/repository/storage";
import cors from "cors";
import { createCorsOptions } from "./config/cors";
import { loggerMiddleware } from "./middleware/logger.middleware";
import type { Config } from "./types/config.type";
import { authorizationMiddleware } from "./middleware/authorization.middleware";
import { UserRepository } from "./repository/user.repository";
import { PaymentRepository } from "./repository/payment.repository";
import { dependencyInjectionMiddleware } from "./middleware/deps_injection.middleware";
import { UserService } from "./service/user.service";
import { UserHandler } from "./handlers/user.handler";
import { PaymentHandler } from "./handlers/payment.handler";
import type { Dependencies } from "./types/middlewaree.type";
import { FlightRepository } from "./repository/flight.repository";
import { FlightService } from "./service/flight.service";
import { CityRepository } from "./repository/city.repository";
import { CompanyRepository } from "./repository/company.repository";
import { AirportRepository } from "./repository/airport.repository";
import { BaggageRuleRepository } from "./repository/baggage-rule.repository";
import { FlightHandler } from "./handlers/flight.handler";
import { BookingRepository } from "./repository/booking.repository";
import { DiscountRepository } from "./repository/discount.repository";
import { createClient, RedisClientType } from "redis";
import { BookingService } from "./service/booking.service";

// Load config
const cfg: Config = readConfig("./config/local.yaml");
console.log("config loaded");

// Connect to storage
const storage: Storage = new Storage(cfg.storage_path);
console.log("storage loaded from path:", cfg.storage_path);

// Connect to Redis server
const redisClient = createClient({
	url: `redis://${cfg.redis_server.host}:${cfg.redis_server.port}`,
})
	.on("error", (err: Error) => console.error("redis connection error", err))
	.connect();
console.log("redis cache connected");

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

// Create services
const userService = new UserService(userRepo, paymentRepo, cfg);
const flightService = new FlightService(flightRepo);
const bookingService = new BookingService(bookingRepo, discountRepo, flightRepo, userRepo);

const app = express();

function startServer() {
	try {
		app.listen(cfg.http_server.port, (err) => {
			console.log(`server is listening on port ${cfg.http_server.port}`);
		});
	} catch (err) {
		console.log(err);
	}
}

// Allow to parse json from request body
app.use(express.json());
// Add logger for request and response
app.use(loggerMiddleware);
// Add possability to view static
app.use("/upload", express.static("./upload"));
app.use(
	"/upload/user",
	authorizationMiddleware,
	express.static("./upload/protected/user")
);
app.use(
	"/upload/booking",
	authorizationMiddleware,
	express.static("./upload/protected/booking")
);

// Add repositories to Express App dependencies
const dependencies: Dependencies = {
	userService,
	flightService,
	bookingService,
	cfg,
};
app.use(dependencyInjectionMiddleware(dependencies));

const masterRouter = Router();
masterRouter.use("/user", UserHandler.router());
masterRouter.use("/user/payment", PaymentHandler.router());
masterRouter.use("/flight", FlightHandler.router());

app.use("/api", masterRouter);

const corsOptions = createCorsOptions(cfg);
app.use(cors(corsOptions));

startServer();
