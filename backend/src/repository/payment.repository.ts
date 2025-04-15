import type { PaymentEntry } from "../types/payment.type";
import { BaseRepository } from "./base.repository";

export class PaymentRepository extends BaseRepository<PaymentEntry> {
	public getTableName(): string {
		return "payment";
	}

	public create() {
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS payment (
				id INTEGER PRIMARY KEY,
				-- foreign key to user(id),
				user_id INTEGER NOT NULL,
				-- card number
				number TEXT NOT NULL CHECK(length(number) == 16),
				-- card expire date
				expires TEXT NOT NULL CHECK(length(expires) == 4),
				-- card cvv
				cvv TEXT NOT NULL CHECK(length(cvv) == 3),
				-- delete payment entry if user deletes
				FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
			);
		`,
			[]
		);
	}

	public add({ user_id, number, expires, cvv }: PaymentEntry): bigint {
		const { lastID } = this.storage.run(
			`
				INSERT INTO payment
					(user_id, number, expires, cvv)
				VALUES
					(?, ?, ?, ?)
			`,
			[user_id, number, expires, cvv]
		);
		return lastID as bigint;
	}

	public getByUserID(user_id: number): PaymentEntry[] | null {
		const entry = this.storage.all<PaymentEntry>(
			`
				SELECT * FROM payment WHERE user_id = ?
			`,
			[user_id]
		);
		return entry ? entry : null;
	}
}
