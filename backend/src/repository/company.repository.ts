import type { CompanyEntry } from "../types/company.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class CompanyRepository extends BaseRepository<CompanyEntry> {
	public getTableName(): string {
		return "company";
	}

	protected create(): void {
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				logo TEXT NOT NULL,
				baggage_rule_id INTEGER NOT NULL,
				FOREIGN KEY (baggage_rule_id) REFERENCES baggage_rule(id) ON DELETE SET NULL
			);
		`,
			[]
		);

		this.storage.run(
			`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_company ON ${this.getTableName()}(name)
		`,
			[]
		);
	}

	public add({ name, logo, baggage_rule_id }: CompanyEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO
				${this.getTableName()}(name, logo, baggage_rule_id)
			VALUES
				(?, ?, ?)
		`,
			[name, logo, baggage_rule_id]
		);
		return lastID as bigint;
	}

	public update(
		id: number,
		{ name, logo, baggage_rule_id }: CompanyEntry
	): number {
		const { changes } = this.storage.run(
			`
			UPDATE ${this.getTableName()} SET
				name = ?,
				logo = ?,
				baggage_rule_id = ?,
			WHERE
				id = ?
		`,
			[name, logo, baggage_rule_id, id]
		);
		return changes;
	}

	public getByName(id: number, name: string): CompanyEntry | null {
		const company = this.storage.get<CompanyEntry>(
			`
			SELECT * FROM ${this.getTableName()} WHERE name = ?
		`,
			[name]
		);
		return company;
	}
}
