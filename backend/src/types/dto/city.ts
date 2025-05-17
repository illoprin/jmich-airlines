import type { AirportEntry, CityEntry } from "@/types/repository/city";

export interface CityDTO extends CityEntry {
  airports: AirportEntry[];
}
