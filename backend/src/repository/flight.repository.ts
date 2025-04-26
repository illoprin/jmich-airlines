import type { FlightEntry } from "../types/flight.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class FlightRepository extends BaseRepository<FlightEntry> {
	public getTableName(): string {
		return "flight";
	}

	protected create() {
		// Create table
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				route_code TEXT NOT NULL CHECK(route_code GLOB '[A-Z][0-9][0-9][0-9]'),
				departure_airport_id INTEGER NOT NULL,
				arrival_airport_id INTEGER NOT NULL,
				departure_date DATETIME NOT NULL CHECK(departure_date > CURRENT_TIMESTAMP),
				arrival_date DATETIME NOT NULL,
				company_id INTEGER NOT NULL,
				seats_available INTEGER NOT NULL CHECK(seats_available BETWEEN 0 AND 512),
				price REAL NOT NULL,
				status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'COMPLETED', 'DELAYED', 'CANCELLED')),
				
				FOREIGN KEY(departure_airport_id) REFERENCES airport(id) ON DELETE SET NULL,
				FOREIGN KEY(arrival_airport_id) REFERENCES airport(id) ON DELETE SET NULL,
				FOREIGN KEY(company_id) REFERENCES company(id) ON DELETE SET NULL
			);
			`,
			[]
		);

		// Create indexes for search optimization
		this.storage.run(
			`CREATE INDEX IF NOT EXISTS idx_flight_departure ON ${this.getTableName()}(departure_airport_id, status)`,
			[]
		);
		this.storage.run(
			`CREATE INDEX IF NOT EXISTS idx_flight_arrival ON ${this.getTableName()}(arrival_airport_id, status)`,
			[]
		);
		this.storage.run(
			`CREATE INDEX IF NOT EXISTS idx_flight_dates ON ${this.getTableName()}(departure_date, status)`,
			[]
		);
	}

	public add(flight: FlightEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO ${this.getTableName()}
				(route_code, departure_airport_id, arrival_airport_id, departure_date, 
				arrival_date, company_id, seats_available, price, status)
			VALUES
				(?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			[
				flight.route_code,
				flight.departure_airport_id,
				flight.arrival_airport_id,
				flight.departure_date.toISOString(),
				flight.arrival_date.toISOString(),
				flight.company_id,
				flight.seats_available,
				flight.price,
				flight.status,
			]
		);
		return lastID as bigint;
	}

	public update(flight: FlightEntry): number {
		const { changes } = this.storage.run(
			`
			UPDATE ${this.getTableName()} SET
					route_code = ?,
					departure_airport_id = ?,
					arrival_airport_id = ?,
					departure_date = ?,
					arrival_date = ?,
					company_id = ?,
					seats_available = ?,
					price = ?,
					status = ?
			WHERE
					id = ?
			`,
			[
				flight.route_code,
				flight.departure_airport_id,
				flight.arrival_airport_id,
				flight.departure_date.toISOString(),
				flight.arrival_date.toISOString(),
				flight.company_id,
				flight.seats_available,
				flight.price,
				flight.status,
				flight.id,
			]
		);
		return changes;
	}

	/**
	 * Search active flights by criteria
	 */
	public searchActiveFlights(
		departureAirportId?: number,
		arrivalAirportId?: number,
		departureDate?: Date,
		minSeatsAvailable: number = 1
	): FlightEntry[] {
		// Build WHERE conditions dynamically based on provided parameters
		const conditions: string[] = ["status = 'ACTIVE'"];
		const params: any[] = [];

		if (departureAirportId !== undefined) {
			conditions.push("departure_city_id = ?");
			params.push(departureAirportId);
		}

		if (arrivalAirportId !== undefined) {
			conditions.push("arrival_city_id = ?");
			params.push(arrivalAirportId);
		}

		if (departureDate !== undefined) {
			const dateStr = departureDate.toISOString().split("T")[0];
			conditions.push("date(departure_date) > date(?)");
			params.push(dateStr);
		}

		conditions.push("seats_available >= ?");
		params.push(minSeatsAvailable);

		const whereClause =
			conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		const query = `
			SELECT * FROM ${this.getTableName()}
			${whereClause}
			ORDER BY departure_date ASC
		`;

		const entries = this.storage.all<FlightEntry>(query, params);
		return entries || [];
	}

	/**
	 * Search for nearest flights from current date
	 */
	public searchNearest(): FlightEntry[] {
		const query = `
			SELECT * FROM ${this.getTableName()}
			WHERE departure_date > date(?)
			ORDER BY departure_date ASC
		`;
		const nowDate = new Date().toISOString().split("T")[0];
		const entries = this.storage.all<FlightEntry>(query, [nowDate]);
		return entries || [];
	}

	/**
	 * Update available seats count
	 */
	public updateSeats(id: number, seatsChange: number): number {
		const { changes } = this.storage.run(
			`
			UPDATE ${this.getTableName()}
			SET seats_available = seats_available + ?
			WHERE id = ? AND seats_available + ? >= 0
			`,
			[seatsChange, id, seatsChange]
		);
		return changes;
	}
}
