import { Router } from "express";
import { UserHandler } from "./handlers/user.handler";
import { FlightHandler } from "./handlers/flight.handler";
import { BookingHandler } from "./handlers/booking.handler";
import { CityHandler } from "./handlers/city.handler";
import { CompanyHandler } from "./handlers/company.handler";

export function initRouter(): Router {
	const router = Router();

	router.use("/user", UserHandler.router());
	router.use("/flight", FlightHandler.router());
	router.use("/booking", BookingHandler.router());
	router.use("/city", CityHandler.router());
	router.use("/company", CompanyHandler.router());

	return router;
}
