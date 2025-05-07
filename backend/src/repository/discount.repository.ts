import { DiscountEntry } from "../types/discount.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class DiscountRepository extends BaseRepository<DiscountEntry> {
	public getTableName(): string {
		return "discount";
	}

	protected create(): void {
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				code TEXT NOT NULL UNIQUE CHECK(length(code) < 64),
				amount REAL NOT NULL CHECK(amount BETWEEN 0 AND 1),
				valid_until DATE NOT NULL
					DEFAULT (date('now', '+20 days'))
					CHECK(date(valid_until) > date(CURRENT_TIMESTAMP))
			)
		`,
			[]
		);

		this.storage.run(
			`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_disount_code ON ${this.getTableName()}(code)
		`,
			[]
		);
	}

	public add({ code, amount, valid_until }: DiscountEntry): bigint {
		const { lastID } = this.storage.run(
			`
				INSERT INTO ${this.getTableName()}(code, amount, valid_until)
				VALUES
					(?, ?, ?)
			`,
			[code, amount, valid_until.toISOString()]
		);
		return lastID as bigint;
	}

	public getAllValid(): DiscountEntry[] | null {
		const sql = `
			SELECT *
			FROM
				${this.getTableName()}
			WHERE
				valid_until > CURRENT_TIMESTAMP
		`;
		const discounts = this.storage.all<DiscountEntry>(sql, []);
		return discounts;
	}

	public deleteInvalid(): number {
		const sql = `
			DELETE FROM ${this.getTableName()}
			WHERE
				date(valid_until) < date(CURRENT_TIMESTAMP)
		`;
		const { changes } = this.storage.run(sql, []);
		return changes;
	}

	public getByCode(code: string): DiscountEntry | null {
		const entry = this.storage.get(
			`
			SELECT * FROM ${this.getTableName()} WHERE code = ?
		`,
			[code]
		);
		return entry;
	}
}
