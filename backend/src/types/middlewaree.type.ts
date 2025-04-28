import { NextFunction, Request, Response } from "express";
import type { UserService } from "../service/user.service";
import type { Config } from "./config.type";
import type { FlightService } from "../service/flight.service";
import type { BookingService } from "../service/booking.service";

export type MiddlewareFunc = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;
export type HTTPHandlerFunc = (req: Request, res: Response) => void;

export interface Dependencies {
	userService: UserService;
	flightService: FlightService;
	bookingService: BookingService;
	cfg: Config;
}
