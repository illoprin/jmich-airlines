import { HOUR_MILLISECONDS } from "./const";
import type { AirportEntry } from "../../types/repository/city";
import type { CompanyEntry } from "../../types/repository/company";
import type { FlightEntry } from "../../types/repository/flight";
import { generateRandomRouteCode, randomIndex } from "./random";

export function randomFlight(
  startTime: number,
  maxDuration: number,
  maxPrice: number,
  companies: CompanyEntry[],
  airports: AirportEntry[],
): FlightEntry {
  const dai = randomIndex(airports.length); // Departure airport index
  let aai: number = randomIndex(airports.length); // Arrival airport index
  while (aai === dai) {
    aai = randomIndex(airports.length);
  }
  const departure_date = new Date(Date.now() + startTime);
  const arrival_date = new Date(
    Date.now() +
      startTime +
      (maxDuration * Math.random() + 1.0) * HOUR_MILLISECONDS,
  );
  const price = Math.ceil(Math.random() * maxPrice);
  const route_code = generateRandomRouteCode();
  const seats_available = Math.floor(Math.random() * 200) + 10;
  const ci = randomIndex(companies.length); // Company index
  return {
    departure_airport_id: airports[dai].id as number,
    arrival_airport_id: airports[aai].id as number,
    company_id: companies[ci].id as number,
    departure_date,
    arrival_date,
    price,
    route_code,
    seats_available,
  };
}
