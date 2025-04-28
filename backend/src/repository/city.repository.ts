import { CityEntry } from "../types/city.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class CityRepository extends BaseRepository<CityEntry> {
	public getTableName(): string {
		return "city";
	}

	protected create(): void {
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL UNIQUE,
				image TEXT NOT NULL DEFAULT '/upload/city_default.jpg'
			)
			`,
			[]
		);

		this.storage.run(
			`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_city ON ${this.getTableName()}(name)
		`,
			[]
		);
	}

	public add({ name, image }: CityEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO ${this.getTableName()} (name, image) VALUES (?, ?)
		`,
			[name, image]
		);
		return lastID as bigint;
	}

	public update(id: number, { name, image }: CityEntry): number {
		const { changes } = this.storage.run(
			`
			UPDATE ${this.getTableName()} SET
				name = ?,
				image = ?
			WHERE
				id = ?
		`,
			[name, image, id]
		);
		return changes;
	}

	public getByName(name: string): CityEntry | null {
		const entry = this.storage.get<CityEntry>(
			`
			SELECT * FROM ${this.getTableName()} WHERE name = ?
		`,
			[name]
		);
		return entry;
	}
}
