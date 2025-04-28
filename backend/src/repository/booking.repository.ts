import { BookingDTO, BookingEntry, BookingStatus } from "../types/booking.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class BookingRepository extends BaseRepository<BookingEntry> {
	public getTableName(): string {
		return "booking";
	}

	protected create(): void {
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				flight_id INTEGER NOT NULL,
				user_id INTEGER NOT NULL,
				baggage_weight INTEGER NOT NULL,
				created DATETIME DEFAULT CURRENT_TIMESTAMP,
				qr_code TEXT NOT NULL,
				cost INTEGER CHECK(cost >= 0),
				status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'CANCELLED', 'COMPLETED')) DEFAULT 'ACTIVE',

				FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE SET NULL,
				FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
			)
		`,
			[]
		);

		this.storage.run(
			`
			CREATE INDEX IF NOT EXISTS idx_booking_user ON ${this.getTableName()}(user_id)
		`,
			[]
		);

		this.storage.run(
			`
			CREATE INDEX IF NOT EXISTS idx_booking_flight ON ${this.getTableName()}(flight_id)
		`,
			[]
		);
	}

	public add({
		flight_id,
		user_id,
		baggage_weight,
		qr_code,
		cost,
	}: BookingEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO ${this.getTableName()}
				(flight_id, user_id, baggage_weight, qr_code, cost)
			VALUES
				(?, ?, ?, ?, ?)
		`,
			[flight_id, user_id, baggage_weight, qr_code, cost]
		);
		return lastID as bigint;
	}

	public getDTOQuery(whereClause: string, usePagination: boolean) {
		return `
			SELECT
				f.id AS flight_id,
				f.route_code AS flight_route_code,
				f.departure_date AS flight_departure_date,
				f.arrival_date AS flight_arrival_date,
				f.seats_available AS flight_seats,
				f.price AS flight_price,
				f.status AS flight_status,
				
				dep_city.name AS flight_departure_city_name,
				dep_city.image AS flight_departure_city_image,
				dep_airport.code AS flight_departure_airport_code,
				dep_airport.name AS flight_departure_airport_name,
				
				arr_city.name AS flight_arrival_city_name,
				arr_city.image AS flight_arrival_city_image,
				arr_airport.code AS flight_arrival_airport_code,
				arr_airport.name AS flight_arrival_airport_name,

				c.name AS company_name,
				c.logo AS company_logo,
				br.max_free_weight AS company_max_free_weight,
				br.price_per_kg AS company_price_per_kg,

				b.id AS booking_id,
				b.user_id AS booking_user_id,
				b.baggage_weight AS booking_baggage_weight,
				b.qr_code AS booking_qr_code,
				b.created AS booking_created,
				b.cost AS booking_cost,
				b.status AS booking_status
			FROM
				${this.getTableName()} b
			LEFT JOIN
				flight f ON b.flight_id = f.id

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
				baggage_rule br ON c.baggage_rule_id = br.id
			
			${whereClause}

			ORDER BY
				f.departure_date DESC

			${usePagination ? "LIMIT ? OFFSET ?" : ""}
		`;
	}

	public getDTORow(row: any): BookingDTO {
		return {
			flight: {
				route_code: row.flight_route_code,
				departure_city: {
					name: row.flight_departure_city_name,
					image: row.flight_departure_city_image,
					airport: {
						name: row.flight_departure_airport_name,
						code: row.flight_departure_airport_code,
					},
				},
				arrival_city: {
					name: row.flight_arrival_city_name,
					image: row.flight_arrival_city_image,
					airport: {
						name: row.flight_arrival_airport_name,
						code: row.flight_arrival_airport_code,
					},
				},
				departure_date: row.flight_departure_date,
				arrival_date: row.flight_arrival_date,
				price: row.flight_price,
				status: row.flight_status,
				company: {
					name: row.company_name,
					logo: row.company_logo,
					baggage_rule: {
						max_free_weight: row.company_max_free_weight,
						price_per_kg: row.company_price_per_kg,
					},
				},
				seats_available: row.flight_seats,
			},
			baggage_weight: row.booking_baggage_weight,
			created: row.booking_created,
			qr_code: row.booking_qr_code,
			cost: row.booking_cost,
			user_id: row.booking_user_id,
			status: row.booking_status,
			id: row.booking_id,
		};
	}

	public getDTOByUserID(
		user_id: number,
		max?: number,
		page?: number
	): BookingDTO[] | null {
		const whereClause = "WHERE b.user_id = ?";
		let params: any[] = [user_id];

		let pagination = false;
		if (max && page) {
			pagination = true;
			params.push(max, page * max);
		}

		const bookings = this.storage.all<any>(
			this.getDTOQuery(whereClause, false),
			params
		);

		return bookings ? bookings.map((booking) => this.getDTORow(booking)) : null;
	}

	public getDTOByID(id: number): BookingDTO | null {
		const booking = this.storage.get<any>(
			this.getDTOQuery("WHERE b.id = ?", false),
			[id]
		);
		return booking ? this.getDTORow(booking) : null;
	}

	public updateStatus(id: number, status: BookingStatus): number {
		const { changes } = this.storage.run(`
			UPDATE ${this.getTableName()} SET status = ? WHERE id = ? 
		`, [status, id]);
		return changes;
	}

	public getDTOAll(max?: number, page?: number): BookingDTO[] | null {
		let params: any[] = [];

		let pagination = false;
		if (max && page) {
			pagination = true;
			params.push(max, page * max);
		}

		const bookings = this.storage.all<any>(this.getDTOQuery("", false), params);

		return bookings ? bookings.map((booking) => this.getDTORow(booking)) : null;
	}

	public getByUserID(user_id: number): BookingEntry[] | null {
		const entries = this.storage.all<BookingEntry>(
			`
			SELECT * FROM ${this.getTableName()} WHERE user_id = ?
		`,
			[user_id]
		);
		return entries;
	}

	public getByFlightID(flight_id: number): BookingEntry[] | null {
		const entries = this.storage.all<BookingEntry>(
			`
			SELECT * FROM ${this.getTableName()} WHERE flight_id = ?
		`,
			[flight_id]
		);
		return entries;
	}
}
