import type { FlightDTO, FlightEntry } from "../types/flight.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class FlightRepository extends BaseRepository<FlightEntry> {
	public getTableName(): string {
		return "flight";
	}

	public getCacheKey(): string {
		return "flight_";
	}

	private getDTOQuery(whereClause: string, usePagination: boolean = false) : string {
		return `
			SELECT
				f.id AS flight_id,
				f.route_code AS flight_route_code,
				f.departure_date AS flight_departure_date,
				f.arrival_date AS flight_arrival_date,
				f.seats_available AS flight_seats,
				f.price AS flight_price,
				f.status AS flight_status,
				
				dep_city.name AS departure_city_name,
				dep_city.image AS departure_city_image,
				dep_airport.code AS departure_airport_code,
				dep_airport.name AS departure_airport_name,
				
				arr_city.name AS arrival_city_name,
				arr_city.image AS arrival_city_image,
				arr_airport.code AS arrival_airport_code,
				arr_airport.name AS arrival_airport_name,

				c.name AS company_name,
				c.logo AS company_logo,
				b.max_free_weight AS company_max_free_weight,
				b.price_per_kg AS company_price_per_kg
			FROM
				${this.getTableName()} f

			LEFT JOIN
				airport dep_airport ON f.departure_airport_id = dep_airport.id
			LEFT JOIN
				city dep_city ON dep_airport.city_id = dep_city.id
			 
			LEFT JOIN
				airport arr_airport ON f.arrival_airport_id = arr_airport.id
			LEFT JOIN
				city arr_city ON arr_airport.city_id = arr_city.id

			LEFT JOIN
				company c ON f.company_id = c.id
			LEFT JOIN
				baggage_rule b ON c.baggage_rule_id = b.id
			
			${whereClause}

			ORDER BY
				f.departure_date DESC

			${usePagination ? "LIMIT ? OFFSET ?" : ""}
		`;
	}

	private getDTORow(row: any | null) : FlightDTO | null {
		return row ? {
			id: row.flight_id,
			route_code: row.flight_route_code,
			departure_city: {
				name: row.departure_city_name,
				airport: {
					code: row.departure_airport_code,
					name: row.departure_airport_name,
				},
				image: row.departure_city_image,
			},
			arrival_city: {
				name: row.arrival_city_name,
				airport: {
					code: row.arrival_airport_code,
					name: row.arrival_airport_name,
				},
				image: row.arrival_city_image,
			},
			departure_date: new Date(row.flight_departure_date),
			arrival_date: new Date(row.flight_arrival_date),
			company: {
				name: row.company_name,
				logo: row.company_logo,
				baggage_rule: {
					max_free_weight: row.company_max_free_weight,
					price_per_kg: row.company_price_per_kg,
				},
			},
			seats_available: row.flight_seats,
			price: row.flight_price,
			status: row.flight_status,
		} : null;
	}

	protected create() {
		// Create table
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				route_code TEXT NOT NULL UNIQUE CHECK(route_code GLOB '[A-Z][0-9][0-9][0-9]'),
				departure_airport_id INTEGER NOT NULL,
				arrival_airport_id INTEGER NOT NULL,
				departure_date DATETIME NOT NULL,
				arrival_date DATETIME NOT NULL,
				company_id INTEGER NOT NULL,
				seats_available INTEGER NOT NULL CHECK(seats_available BETWEEN 0 AND 512),
				price INTEGER NOT NULL CHECK(price > 0),
				status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'COMPLETED', 'DELAYED', 'CANCELLED')) DEFAULT 'ACTIVE',
				
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
				arrival_date, company_id, seats_available, price)
			VALUES
				(?, ?, ?, ?, ?, ?, ?, ?)
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
			]
		);
		return lastID as bigint;
	}

	public update(flight: FlightEntry): number {
		// TODO: delete redis cache
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
		minSeatsAvailable: number = 1,
		max?: number,
		page?: number,
	): FlightDTO[] | null {
		// Build WHERE conditions dynamically based on provided parameters
		const conditions: string[] = ["status = 'ACTIVE'"];
		const params: any[] = [];

		if (departureAirportId !== undefined) {
			conditions.push("f.departure_airport_id = ?");
			params.push(departureAirportId);
		}

		if (arrivalAirportId !== undefined) {
			conditions.push("f.arrival_airport_id = ?");
			params.push(arrivalAirportId);
		}

		if (departureDate !== undefined) {
			const dateStr = departureDate.toISOString().split("T")[0];
			conditions.push("date(f.departure_date) >= date(?)");
			params.push(dateStr);
		}

		conditions.push("f.seats_available >= ?");
		params.push(minSeatsAvailable);

		const whereClause =
			conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
		
		let pagination = false;
		if (max && page) {
			pagination = true;
			params.push(max, max * page);
		}

		const query = this.getDTOQuery(whereClause, pagination);
		const rows = this.storage.all<any>(query, params);
		return rows ? rows.map(row => this.getDTORow(row) as FlightDTO) : null;
	}

	public getDTOByID(id: number): FlightDTO | null {
		const whereClause = `WHERE f.id = ?`;
		const params = [id];
		const row = this.storage.get<any>(
			this.getDTOQuery(whereClause), params
		);
		return this.getDTORow(row);
	}

	public getDTOAll(max: number, page: number): FlightDTO[] | null {
		const rows = this.storage.all<any>(this.getDTOQuery(""), [max, page]);
		return rows ? rows.map(row => this.getDTORow(row) as FlightDTO) : null;
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
