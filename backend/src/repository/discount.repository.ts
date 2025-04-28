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
				valid_until DATE NOT NULL DEFAULT (date('now', '+20 days'))
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

	public getByCode(code: string): DiscountEntry | null {
		const entry = this.storage.get(
		`
			SELECT * FROM ${this.getTableName} WHERE code = ?
		`,
			[code]
		);
		return entry;
	}
}
