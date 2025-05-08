import type { FlightDTO } from "./flght";
import type { Entry } from "../../lib/repository/base.repository";
import { BookingStatus } from "../repository/booking";

export interface BookingDTO extends Entry {
	created: Date;
	flight: FlightDTO;
	user_id: number;
	seats: number;
	qr_code: string;
	baggage_weight: number;
	cost: number;
	status: BookingStatus;
}