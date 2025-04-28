import type { FlightDTO } from "./flight.type";
import type { Entry } from "../lib/repository/base.repository";

export enum BookingStatus {
	ACTIVE = "ACTIVE",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED"
}

export interface BookingEntry extends Entry {
	flight_id?: number;
	user_id: number;
	baggage_weight: number;
	created?: Date;
	qr_code: string;
	cost: number;
	status?: BookingStatus;
}

export interface BookingDTO extends Entry {
	created: Date;
	flight: FlightDTO;
	user_id: number;
	qr_code: string;
	baggage_weight: number;
	cost: number;
	status: BookingStatus;
}