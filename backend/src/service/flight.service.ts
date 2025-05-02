import type { FlightRepository } from "../repository/flight.repository";
import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import {
	FlightDTO,
	FlightEntry,
	FlightSearchPayload,
	FlightStatus,
} from "../types/flight.type";
import {
	RelatedDataError,
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
} from "../types/service.type";
import type { CompanyEntry } from "../types/company.type";
import type { AirportEntry } from "../types/city.type";
import { DAY_MILLISECONDS, HOUR_MILLISECONDS } from '../lib/service/const'
import { randomFlight } from "../lib/service/random-flight";

export class FlightService {
	constructor(private flightRepo: FlightRepository) {}

	/**
	 * Create new flight
	 * @throws {InvalidFieldError}
	 * @throws {NotUniqueError}
	 */
	public add(entry: FlightEntry): bigint {
		if (entry.departure_date < new Date()) {
			throw new InvalidFieldError("departure date cannot be in past");
		} else if (entry.arrival_date < entry.departure_date) {
			throw new InvalidFieldError(
				"arrival date cannot be less than departure date"
			);
		}

		try {
			return this.flightRepo.add(entry);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError(
						`${err.message}: invalid field '${err.field}'`
					);
				} else if (err.type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError(
						`${err.message}: invalid field'${
							err.field != "?" ? " " + err.field : ""
						}'`
					);
				} else if (err.type == StorageErrorType.FOREIGN_KEY) {
					throw new InvalidFieldError(err.message);
				}
			}
			throw err;
		}
	}

	/**
	 * Update flight data excluding status
	 * @throws {NotFoundError}
	 * @throws {InvalidFieldError}
	 * @throws {NotUniqueError}
	 */
	public updateGeneral(id: number, payload: any) {
		const flight = this.flightRepo.getByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}

		// FIX: use validation before repository query
		// WARN: hardcoded fields
		const edited: FlightEntry = {
			id,
			route_code: payload.route_code ?? flight.route_code,
			departure_airport_id:
				payload.departure_airport_id ?? flight.departure_airport_id,
			arrival_airport_id:
				payload.arrival_airport_id ?? flight.arrival_airport_id,
			departure_date: payload.departure_date ?? new Date(flight.departure_date),
			arrival_date: payload.arrival_date ?? new Date(flight.arrival_date),
			company_id: payload.company_id ?? flight.company_id,
			price: payload.price ?? flight.price,
			seats_available: flight.seats_available,
			status: flight.status,
		};
		try {
			this.flightRepo.update(edited);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError(`invalid field '${err.field}'`);
				} else if (err.type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError(
						`invalid field'${err.field != "?" ? err.field : ""}'`
					);
				} else if (err.type == StorageErrorType.FOREIGN_KEY) {
					throw new InvalidFieldError(err.message);
				}
			} else {
				throw err;
			}
		}
	}

	/**
	 * Update status of flight
	 * @throws {NotFoundError}
	 * @throws {InvalidFieldError}
	 */
	public updateStatus(id: number, status: FlightStatus) {
		const flight = this.flightRepo.getByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}
		flight.departure_date = new Date(flight.departure_date);
		flight.arrival_date = new Date(flight.arrival_date);
		flight.status = status;

		try {
			this.flightRepo.update(flight);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError(`invalid field '${err.field.split(' ')[0]}'`);
				}
			} else {
				throw err;
			}
		}
	}

	private findCheapest(flights: FlightDTO[]): FlightDTO[] {
		let minPrice = Number.MAX_SAFE_INTEGER;
		let minPriceIndex = Number.MAX_SAFE_INTEGER;
		for (let i = 0; i < flights.length; i++) {
			const flight = flights[i];
			if (flight.price < minPrice) {
				minPrice = flight.price;
				minPriceIndex = i;
			}
		}
		if (minPriceIndex < flights.length) {
			flights[minPriceIndex].cheapest = true;
		}

		return flights;
	}

	/**
	 * Search active flights by query
	 * @throws {InvalidFieldError}
	 * @throws {NotFoundError}
	 */
	public search(payload: FlightSearchPayload): FlightDTO[] {
		if (payload.departure_date) {
			if (payload.departure_date.getMilliseconds() <= Date.now()) {
				throw new InvalidFieldError("departure date cannot be in past");
			}
		}

		let flights = this.flightRepo.searchActiveFlights(
			payload.departure_airport_id,
			payload.arrival_airport_id,
			payload.departure_date,
			payload.seats,
			payload.max,
			payload.page
		);

		if (!flights) {
			return [];
		}
		flights = this.findCheapest(flights);
		return flights;
	}

	/**
	 * Update seats count
	 * @throws {NotFoundError}
	 */
	public deltaSeats(id: number, delta: number): number {
		const flight = this.flightRepo.getByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}
		return this.flightRepo.updateSeats(id, delta);
	}

	public addRandom(
		quantity: number,
		daysRange: number,
		maxFlightDuration: number,
		maxPrice: number,
		airports: AirportEntry[],
		companies: CompanyEntry[]
	): Error[] {
		// FIX: create separate function to generate random flight
		console.log(
			"Generating random flights:\n" +
				"Quantity: %d\n" +
				"Days: %d\n" +
				"Max Duration: %d\n" +
				"Max Price: %d\n",
			quantity,
			daysRange,
			maxFlightDuration,
			maxPrice
		);
		let errors: Error[] = [];
		const flightsPerDay = Math.ceil(daysRange / quantity);
		let currentDay = 0;
		for (let i = 0; i < quantity; i++) {
			const startTime =
				DAY_MILLISECONDS * currentDay +
				(i % flightsPerDay) * HOUR_MILLISECONDS * maxFlightDuration;
			const flight = randomFlight(
				startTime,
				maxFlightDuration,
				maxPrice,
				companies,
				airports
			);

			try {
				this.add(flight);
				if (i % flightsPerDay === 0) {
					currentDay++;
				}
			} catch (err) {
				errors.push(err as Error);
			}
		}
		return errors;
	}

	/**
	 * Get fight DTO by ID
	 * @throws {NotFoundError}
	 */
	public getByID(id: number): FlightDTO {
		const flight = this.flightRepo.getDTOByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}
		return flight;
	}

	public getAll(max: number, page: number): FlightDTO[] {
		const flights = this.flightRepo.getDTOAll(max, page);
		return flights ?? [];
	}

	/**
	 * Remove flight entry by id
	 * @throws {NotFoundError}
	 * @throws {RelatedDataError}
	 */
	public removeByID(id: number) {
		try {
			const changes = this.flightRepo.removeByID(id);
			if (!changes) {
				throw new NotFoundError("flight not found");
			}
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.RELATED) {
					throw new RelatedDataError(err.message);
				}
			}
		}
	}
	
	public completeExpired(): number {
		const changes = this.flightRepo.completeExpired(FlightStatus.COMPLETED);
		return changes;
	}
}
