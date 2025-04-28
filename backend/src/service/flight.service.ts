import type { FlightRepository } from "../repository/flight.repository";
import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import type {
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

export class FlightService {
	constructor(private flightRepo: FlightRepository) {}

	/**
	 * @throws {InvalidFieldError}
	 * @throws {NotUniqueError}
	 */
	public add(entry: FlightEntry): bigint {
		try {
			return this.flightRepo.add(entry);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError(`${err.message}: invalid field '${err.field}'`);
				} else if (err.type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError(
						`${err.message}: invalid field'${err.field != "?" ? " " + err.field : ""}'`
					);
				} else if (err.type == StorageErrorType.FOREIGN_KEY) {
					throw new InvalidFieldError(err.message);
				}
			}
			throw err;
		}
	}

	/**
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
			route_code: payload.route_code ?? flight.route_code,
			departure_airport_id:
				payload.departure_airport_id ?? flight.departure_airport_id,
			arrival_airport_id:
				payload.arrival_airport_id ?? flight.arrival_airport_id,
			departure_date: payload.departure_date ?? flight.departure_date,
			arrival_date: payload.arrival_date ?? flight.arrival_date,
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
	 * @throws {NotFoundError}
	 * @throws {InvalidFieldError}
	 */
	public updateStatus(id: number, status: FlightStatus) {
		const flight = this.flightRepo.getByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}
		flight.status = status;
		this.flightRepo.update(flight);
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
	 * @throws {InvalidFieldError}
	 * @throws {NotFoundError}
	 */
	public search(payload: FlightSearchPayload): FlightDTO[] {
		if (payload.departure_date) {
			if (payload.departure_date.getMilliseconds() <= Date.now()) {
				throw new InvalidFieldError("invalid departure date in search request");
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
			throw new NotFoundError(
				"there are no active flights matching your request"
			);
		}
		flights = this.findCheapest(flights);
		return flights;
	}

	/**
	 * @throws {NotFoundError}
	 */
	public deltaSeats(id: number, delta: number): number {
		const flight = this.flightRepo.getByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}
		return this.flightRepo.updateSeats(id, delta);
	}

	public addRandom(quantity: number, days_range: number): FlightEntry[] {
		// TODO: add random flights
		return [];
	}

	/**
	 * @throws {NotFoundError}
	 */
	public getByID(id: number): FlightDTO {
		const flight = this.flightRepo.getDTOByID(id);
		if (!flight) {
			throw new NotFoundError("flight not found");
		}
		return flight;
	}

	public getAll(): FlightDTO[] {
		// TODO: get all entries
		// TODO: pagination
		return [];
	}

	/**
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
}
