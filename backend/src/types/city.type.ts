import type { Entry } from "./repository.type";

export interface CityEntry extends Entry {
	name: string;
	image: string;
}

export interface AirportEntry extends Entry {
	city_id: number;
	name: string;
	code: string;
}