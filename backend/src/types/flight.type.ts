import type { Entry } from "./repository.type";

export enum FlightStatus {
	ACTIVE = "ACTIVE",
	COMPLETED = "COMPLETED",
	DELAYED = "DELAYED",
	CANCELLED = "CANCELLED",
}

export interface FlightDTO {
	id: number;
	route_code: string;
	departure_city: {
		name: string;
		airport: string; // Airport code
		img: string; // City image
	};
	arrival_city: {
		name: string;
		airport: string; // Airport code
		img: string; // City image
	};
	departure_date: Date;
	arrival_date: Date;
	company: {
		name: string;
		logo: string;
		baggage_rule?: {
			max_free_weight: number;
			price_per_kg: number;
		};
	};
	seats_available: number;
	price: number;
	status: FlightStatus;
}

export interface FlightSearchPayload {
	departure_city_id: number;
	arrival_city_id: number;
	departure_date: Date;
	seats_required: number;
}

export interface FlightEntry extends Entry {
	route_code: string;
	departure_airport_id: number;
	arrival_airport_id: number;
	departure_date: Date;
	arrival_date: Date;
	company_id: number;
	seats_available?: number;
	price: number;
	status?: FlightStatus;
	cheapest?: boolean;
}
