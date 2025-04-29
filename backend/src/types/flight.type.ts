import type { Entry } from "../lib/repository/base.repository";
import { AirportEntry } from "./city.type";
import { BaggageRuleEntry, CompanyDTO } from "./company.type";

export enum FlightStatus {
	ACTIVE = "ACTIVE",
	COMPLETED = "COMPLETED",
	DELAYED = "DELAYED",
	CANCELLED = "CANCELLED",
}

export interface FlightDTO extends Entry {
	route_code: string;
	departure_city: {
		id?: number;
		name: string;
		airport: AirportEntry;
		image: string; // City image
	};
	arrival_city: {
		id?: number;
		name: string;
		airport: AirportEntry;
		image: string; // City image
	};
	departure_date: Date;
	arrival_date: Date;
	company: CompanyDTO;
	seats_available: number;
	price: number;
	status: FlightStatus;
	cheapest?: boolean
}

export interface FlightSearchPayload {
	departure_airport_id?: number;
	arrival_airport_id?: number;
	departure_date?: Date;
	seats?: number;
	max: number;
	page: number;
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
}
