import type { FlightRepository } from "../repository/flight.repository";
import {
  StorageError,
  StorageErrorType,
} from "../lib/repository/storage-error";
import { type FlightEntry, FlightStatus } from "../types/repository/flight";
import type { FlightDTO } from "../types/dto/flight";
import {
  RelatedDataError,
  InvalidFieldError,
  NotFoundError,
  NotUniqueError,
} from "../lib/service/errors";
import type { CompanyEntry } from "../types/repository/company";
import type { AirportEntry } from "../types/repository/city";
import { DAY_MILLISECONDS, HOUR_MILLISECONDS } from "../lib/service/const";
import { randomFlight } from "../lib/service/random-flight";
import { FlightCache } from "../redis/flight.cache";
import type { FlightSearchPayload } from "../types/handler/flight";

export class FlightService {
  constructor(
    private flightRepo: FlightRepository,
    private flightCache: FlightCache,
  ) {}

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
        "arrival date cannot be less than departure date",
      );
    }

    try {
      return this.flightRepo.add(entry);
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(
            `${err.message}: invalid field '${err.field}'`,
          );
        } else if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError(
            `${err.message}: invalid field'${
              err.field != "?" ? " " + err.field : ""
            }'`,
          );
        } else if (err.type == StorageErrorType.FOREIGN_KEY) {
          throw new InvalidFieldError(err.message);
        }
      }
      throw err;
    }
  }

  /**
   * async Update flight data excluding status
   * @throws {NotFoundError}
   * @throws {InvalidFieldError}
   * @throws {NotUniqueError}
   */
  public async updateGeneral(id: number, payload: any): Promise<void> {
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
      departure_date: new Date(flight.departure_date),
      arrival_date: new Date(flight.arrival_date),
      company_id: payload.company_id ?? flight.company_id,
      price: payload.price ?? flight.price,
      seats_available: payload.seats_available ?? flight.seats_available,
      status: flight.status,
    };

    // WARN: its a shit code
    if (payload.departure_date) {
      edited.departure_date = new Date(payload.departure_date);
    }
    if (payload.arrival_date) {
      edited.arrival_date = new Date(payload.arrival_date);
    }
    ///////////////////////

    try {
      this.flightRepo.update(edited);
      await this.flightCache.invalidate(id);
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(`invalid field '${err.field}'`);
        } else if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError(
            `invalid field'${err.field != "?" ? err.field : ""}'`,
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
  public async updateStatus(id: number, status: FlightStatus): Promise<void> {
    const flight = this.flightRepo.getByID(id);
    if (!flight) {
      throw new NotFoundError("flight not found");
    }
    flight.departure_date = new Date(flight.departure_date);
    flight.arrival_date = new Date(flight.arrival_date);
    flight.status = status;

    try {
      this.flightRepo.update(flight);
      await this.flightCache.invalidate(id);
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(
            `invalid field '${err.field.split(" ")[0]}'`,
          );
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
      if (payload.departure_date <= new Date()) {
        throw new InvalidFieldError("departure date cannot be in past");
      }
    }

    let flights = this.flightRepo.searchActiveFlights(
      payload.departure_airport_id,
      payload.arrival_airport_id,
      payload.departure_date,
      payload.seats,
      isNaN(payload.max) ? 10 : payload.max,
      isNaN(payload.page) ? 10 : payload.page
    );

    return flights ? this.findCheapest(flights) : [];
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
    companies: CompanyEntry[],
  ): Error[] {
    if (airports.length == 0 || companies.length == 0) {
      throw new RelatedDataError(
        "it is not possible to create flights until there are records in the airport and company tables",
      );
    }

    console.log(
      "Generating random flights:\n" +
        "Quantity: %d\n" +
        "Days: %d\n" +
        "Max Duration: %d\n" +
        "Max Price: %d\n",
      quantity,
      daysRange,
      maxFlightDuration,
      maxPrice,
    );
    let errors: Error[] = [];
    const flightsPerDay = Math.ceil(quantity / daysRange);
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
        airports,
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
  public async getByID(id: number): Promise<FlightDTO> {
    const flightCached = await this.flightCache.get(id);
    if (!flightCached) {
      const flight = this.flightRepo.getDTOByID(id);
      if (!flight) {
        throw new NotFoundError("flight not found");
      }
      await this.flightCache.set(id, flight);
      return flight;
    }
    return flightCached;
  }

  public getAll(max: number, page: number, status: string): FlightDTO[] {
    const flights = this.flightRepo.getDTOAll(max, page, status);
    return flights ?? [];
  }

  /**
   * Remove flight entry by id
   * @throws {NotFoundError}
   * @throws {RelatedDataError}
   */
  public async removeByID(id: number) {
    try {
      const changes = this.flightRepo.removeByID(id);
      if (!changes) {
        throw new NotFoundError("flight not found");
      }
      await this.flightCache.invalidate(id);
    } catch (err) {
      if (err instanceof StorageError) {
        if ((err as StorageError).type == StorageErrorType.RELATED) {
          throw new RelatedDataError(err.message);
        }
      }
    }
  }

  public completeExpired(): number {
    return this.flightRepo.completeExpired(FlightStatus.COMPLETED);
  }

  public increasePrice(hoursBefore: number, amount: number): number {
    return this.flightRepo.increasePrice(hoursBefore, amount + 1);
  }
}
