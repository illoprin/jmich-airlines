import type { Entry } from "../../lib/repository/base.repository";
import type { AirportEntry } from "../repository/city";
import type { FlightStatus } from "../repository/flight";
import type { CompanyDTO } from "./company";

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