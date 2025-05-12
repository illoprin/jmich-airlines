import type { AirportEntry, CityEntry } from "../repository/city";

export interface CityDTO extends CityEntry {
  airports: AirportEntry[];
}
