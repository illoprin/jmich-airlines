import type { FlightDTO, FlightEntry } from "../types/flight.type";
import { BaseRepository } from "../lib/repository/base.repository";
import { parseJSONArray } from "../lib/repository/parse";

export class FlightRepository extends BaseRepository<FlightEntry> {
	public getTableName(): string {
		return "flight";
	}

	public getCacheKey(): string {
		return "flight_";
	}

	private getJSONFieldName(): string {
		return "flight_json";
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

	private getDTOQuery(
		whereClause: string,
		usePagination: boolean = false
	): string {
		return `--sql
			SELECT json_object(
				'id', flight.id,
				'route_code', flight.route_code,
				'departure_city', json_object(
					'id', depc.id,
					'name', depc.name,
					'image', depc.image,
					'airport', json_object(
						'id', depa.id,
						'code', depa.code,
						'name', depa.name
					)
				),
				'arrival_city', json_object(
					'id', arrc.id,
					'name', arrc.name,
					'image', arrc.image,
					'airport', json_object(
						'id', arra.id,
						'code', arra.code,
						'name', arra.name
					)
				),
				'company', json_object(
					'id', c.id,
					'name', c.name,
					'logo', c.logo,
					'baggage_rule', json_object(
						'max_free_weight', b.max_free_weight,
						'price_per_kg', b.price_per_kg
					)
				),
				'departure_date', flight.departure_date,
				'arrival_date', flight.arrival_date,
				'price', flight.price,
				'seats_available', flight.seats_available,
				'status', flight.status
			) as ${this.getJSONFieldName()}
			FROM
				${this.getTableName()}
			LEFT JOIN
				airport depa on flight.departure_airport_id = depa.id
			LEFT JOIN
				city depc on depa.city_id = depc.id

			LEFT JOIN
				airport arra on flight.arrival_airport_id = arra.id
			LEFT JOIN
				city arrc on arra.city_id = arrc.id
				
			LEFT JOIN
				company c on flight.company_id = c.id
			LEFT JOIN
				baggage_rule b on c.baggage_rule_id = b.id

			${whereClause}
			ORDER BY flight.departure_date DESC
			${usePagination ? "LIMIT ? OFFSET ?" : ""}
		`;
	}

	private getDTORow(row: any): any {
		row.departure_date = new Date(row.departure_date);
		row.arrival_date = new Date(row.arrival_date);
		return row;
	}

	public add(flight: FlightEntry): bigint {
		const { lastID } = this.storage.run(
			`--sql
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
			`--sql
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
		page?: number
	): FlightDTO[] | null {
		// Build WHERE conditions dynamically based on provided parameters
		const conditions: string[] = [`${this.getTableName()}.status = 'ACTIVE'`];
		const params: any[] = [];

		if (departureAirportId !== undefined) {
			conditions.push(`${this.getTableName()}.departure_airport_id = ?`);
			params.push(departureAirportId);
		}

		if (arrivalAirportId !== undefined) {
			conditions.push(`${this.getTableName()}.arrival_airport_id = ?`);
			params.push(arrivalAirportId);
		}

		if (departureDate !== undefined) {
			const dateStr = departureDate.toISOString().split("T")[0];
			conditions.push(`date(${this.getTableName()}.departure_date) >= date(?)`);
			params.push(dateStr);
		}

		conditions.push(`${this.getTableName()}.seats_available >= ?`);
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

		if (!rows) {
			return null;
		}
		const dtos = parseJSONArray<FlightDTO>(
			rows,
			this.getJSONFieldName(),
			(row) => this.getDTORow(row)
		);
		return dtos;
	}

	public getDTOByID(id: number): FlightDTO | null {
		const whereClause = `WHERE ${this.getTableName()}.id = ?`;
		const params = [id];
		const row = this.storage.get<any>(this.getDTOQuery(whereClause), params);

		if (!row) {
			return null;
		}
		const dto: FlightDTO = this.getDTORow(
			JSON.parse(row[this.getJSONFieldName()])
		);
		return dto;
	}

	public getDTOAll(max: number, page: number): FlightDTO[] | null {
		const rows = this.storage.all<any>(this.getDTOQuery(""), [max, page]);
		if (!rows) {
			return null;
		}
		const dtos = parseJSONArray<FlightDTO>(
			rows,
			this.getJSONFieldName(),
			(row) => this.getDTORow(row)
		);
		return dtos;
	}

	/**
	 * Update available seats count
	 */
	public updateSeats(id: number, seatsChange: number): number {
		const { changes } = this.storage.run(
			`--sql
			UPDATE ${this.getTableName()}
			SET seats_available = seats_available + ?
			WHERE id = ? AND seats_available + ? >= 0
			`,
			[seatsChange, id, seatsChange]
		);
		return changes;
	}
}