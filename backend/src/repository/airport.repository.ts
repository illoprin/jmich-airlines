import type { AirportEntry } from "../types/city.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class AirportRepository extends BaseRepository<AirportEntry> {
	public getTableName(): string {
		return "airport";
	}

	protected create(): void {
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL UNIQUE,
				code TEXT NOT NULL CHECK(code GLOB '[A-Z][A-Z][A-Z]'),
				city_id INTEGER NOT NULL,
				FOREIGN KEY(city_id) REFERENCES city(id) ON DELETE CASCADE
			);
			`,
			[]
		);

		this.storage.run(
			`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_airport_code ON ${this.getTableName()}(code)
			`,
			[]
		);

		this.storage.run(
			`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_airport_name ON ${this.getTableName()}(name)
			`,
			[]
		);
	}

	public add({ name, code, city_id }: AirportEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO ${this.getTableName()}
				(name, code, city_id)
			VALUES
				(?, ?, ?)
			`,
			[name, code, city_id]
		);
		return lastID as bigint;
	}

	public update(id: number, { code, city_id, name }: AirportEntry): number {
		const { changes } = this.storage.run(
			`
			UPDATE ${this.getTableName()} SET
				name = ?,
				city_id = ?,
				code = ?,
			WHERE
				id = ?
			`,
			[name, city_id, code, id]
		);
		return changes;
	}

	public getByCityId(city_id: number): AirportEntry[] | null {
		const entries = this.storage.all<AirportEntry>(
			`
			SELECT * FROM ${this.getTableName()} WHERE city_id = ?
			`,
			[city_id]
		);
		return entries;
	}
}
