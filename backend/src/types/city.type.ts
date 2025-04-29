import type { Entry } from "../lib/repository/base.repository";

export interface CityEntry extends Entry {
	name: string;
	image: string;
}

export interface CityDTO extends CityEntry {
	airports: AirportEntry[];
}

export interface AirportEntry extends Entry {
	city_id?: number;
	name: string;
	code: string;
}
