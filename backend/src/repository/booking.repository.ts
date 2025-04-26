import { BookingEntry } from "../types/booking.type";
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

				FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE CASCADE,
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
			INSERT INTO ${this.getTableName}
				(flight_id, user_id, baggage_weight, qr_code, cost)
			VALUES
				(?, ?, ?, ?, ?, ?)
		`,
			[flight_id, user_id, baggage_weight, qr_code, cost, status]
		);
		return lastID as bigint;
	}

	public getByUserID(user_id: number): BookingEntry[] | null {
		const entries = this.storage.all<BookingEntry>(`
			SELECT * FROM ${this.getTableName()} WHERE user_id = ?
		`, [user_id]);
		return entries;
	}

	public getByFlightID(flight_id: number): BookingEntry[] | null {
		const entries = this.storage.all<BookingEntry>(`
			SELECT * FROM ${this.getTableName()} WHERE flight_id = ?
		`, [flight_id]);
		return entries;
	}
}
