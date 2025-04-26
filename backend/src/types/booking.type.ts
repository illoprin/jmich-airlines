import type { Entry } from "./repository.type";

export interface BookingEntry extends Entry {
	flight_id: number;
	user_id: number;
	baggage_weight: number;
	created?: Date;
	qr_code: string;
	cost: number;
}