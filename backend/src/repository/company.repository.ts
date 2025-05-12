import type { CompanyEntry } from "../types/repository/company";
import type { CompanyDTO } from "../types/dto/company";
import { BaseRepository } from "../lib/repository/base.repository";
import { parseJSONArray } from "../lib/repository/parse";

export class CompanyRepository extends BaseRepository<CompanyEntry> {
  public getTableName(): string {
    return "company";
  }
  private getJSONFieldName(): string {
    return "company_json";
  }

  protected create(): void {
    this.storage.run(
      `--sql
				CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
					id INTEGER PRIMARY KEY,
					name TEXT NOT NULL,
					logo TEXT NOT NULL,
					baggage_rule_id INTEGER NOT NULL,
					FOREIGN KEY (baggage_rule_id) REFERENCES baggage_rule(id) ON DELETE SET NULL
				);
			`,
      [],
    );

    this.storage.run(
      `--sql
				CREATE UNIQUE INDEX IF NOT EXISTS idx_company ON ${this.getTableName()}(name)
			`,
      [],
    );
  }

  private getDTOQuery(whereClause: string): string {
    return `--sql
			SELECT json_object(
				'id', c.id,
				'name', c.name,
				'logo', c.logo,
				'baggage_rule', json_object(
					'id', b.id,
					'max_free_weight', b.max_free_weight,
					'price_per_kg', b.price_per_kg
				)
			) as ${this.getJSONFieldName()}
			FROM
				${this.getTableName()} c
			LEFT JOIN
				baggage_rule b ON c.baggage_rule_id = b.id
			${whereClause}
		`;
  }

  public add({ name, logo, baggage_rule_id }: CompanyEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
				INSERT INTO
					${this.getTableName()}(name, logo, baggage_rule_id)
				VALUES
					(?, ?, ?)
			`,
      [name, logo, baggage_rule_id],
    );
    return lastID as bigint;
  }

  public update(
    id: number,
    { name, logo, baggage_rule_id }: CompanyEntry,
  ): number {
    const { changes } = this.storage.run(
      `--sql
				UPDATE ${this.getTableName()} SET
					name = ?,
					logo = ?,
					baggage_rule_id = ?,
				WHERE
					id = ?
			`,
      [name, logo, baggage_rule_id, id],
    );
    return changes;
  }

  public getByName(name: string): CompanyEntry | null {
    const company = this.storage.get<CompanyEntry>(
      `
			SELECT * FROM ${this.getTableName()} WHERE name = ?
		`,
      [name],
    );
    return company;
  }

  public getDTOByName(name: string): CompanyDTO | null {
    const whereClause = `WHERE c.name = ?`;
    const company = this.storage.get<any>(this.getDTOQuery(whereClause), [
      name,
    ]);
    if (!company || !company[this.getJSONFieldName()]) {
      return null;
    }
    return JSON.parse(company[this.getJSONFieldName()]) as CompanyDTO;
  }

  public getDTOByID(id: number): CompanyDTO | null {
    const whereClause = `WHERE c.id = ?`;
    const company = this.storage.get<any>(this.getDTOQuery(whereClause), [id]);
    if (!company) {
      return null;
    }
    return JSON.parse(company[this.getJSONFieldName()]) as CompanyDTO;
  }

  public getDTOAll(): CompanyDTO[] | null {
    const rows = this.storage.all<any>(this.getDTOQuery(""), []);
    if (!rows) {
      return null;
    }
    const dtos = parseJSONArray<CompanyDTO>(rows, this.getJSONFieldName());
    return dtos;
  }
}
