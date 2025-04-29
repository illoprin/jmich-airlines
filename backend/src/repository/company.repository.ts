import type { CompanyDTO, CompanyEntry } from "../types/company.type";
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

	private getDTOQuery(whereClause: string): string {
		return `
			SELECT
				c.id AS company_id,
				c.name AS company_name,
				c.logo AS company_logo,
				c.baggage_rule_id AS baggage_rule_id,
				b.max_free_weight AS baggage_max_free,
				b.price_per_kg AS baggage_price
			FROM
				company c
			LEFT JOIN
				baggage_rule b ON c.baggage_rule_id = b.id
			${whereClause}
		`;
	}

	private getDTORow(row: any): CompanyDTO {
		return {
			id: row.company_id,
			name: row.company_name,
			logo: row.company_logo,
			baggage_rule: {
				id: row.baggage_rule_id,
				max_free_weight: row.baggage_max_free,
				price_per_kg: row.baggage_price,
			},
		};
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

	public getByName(name: string): CompanyEntry | null {
		const company = this.storage.get<CompanyEntry>(
			`
			SELECT * FROM ${this.getTableName()} WHERE name = ?
		`,
			[name]
		);
		return company;
	}

	public getDTOByName(name: string): CompanyDTO | null {
		const whereClause = `WHERE name = ?`;
		const company = this.storage.get<any>(this.getDTOQuery(whereClause), [
			name,
		]);
		return this.getDTORow(company);
	}

	public getDTOByID(id: number): CompanyDTO | null {
		const whereClause = `WHERE id = ?`;
		const company = this.storage.get<any>(this.getDTOQuery(whereClause), [id]);
		return this.getDTORow(company);
	}
}
