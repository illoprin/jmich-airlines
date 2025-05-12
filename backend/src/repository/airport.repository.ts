import type { AirportEntry } from "../types/repository/city";
import { BaseRepository } from "../lib/repository/base.repository";

export class AirportRepository extends BaseRepository<AirportEntry> {
  public getTableName(): string {
    return "airport";
  }

  protected create(): void {
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL UNIQUE,
				code TEXT NOT NULL CHECK(code GLOB '[A-Z][A-Z][A-Z]'),
				city_id INTEGER,
				FOREIGN KEY(city_id) REFERENCES city(id) ON DELETE CASCADE
			);
			`,
      [],
    );

    this.storage.run(
      `--sql
			CREATE UNIQUE INDEX IF NOT EXISTS idx_airport_code ON ${this.getTableName()}(code)
			`,
      [],
    );

    this.storage.run(
      `--sql
			CREATE UNIQUE INDEX IF NOT EXISTS idx_airport_name ON ${this.getTableName()}(name)`,
      [],
    );
  }

  public add({ name, code, city_id }: AirportEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
			INSERT INTO ${this.getTableName()}
				(name, code, city_id)
			VALUES
				(?, ?, ?)`,
      [name, code, city_id],
    );
    return lastID as bigint;
  }

  public update(id: number, { code, city_id, name }: AirportEntry): number {
    const { changes } = this.storage.run(
      `UPDATE ${this.getTableName()} SET
				name = ?,
				city_id = ?,
				code = ?
			WHERE
				id = ?
			`,
      [name, city_id, code, id],
    );
    return changes;
  }

  public getByCityID(city_id: number): AirportEntry[] | null {
    const entries = this.storage.all<AirportEntry>(
      `SELECT id, name, code FROM ${this.getTableName()} WHERE city_id = ?`,
      [city_id],
    );
    return entries;
  }

  public getByCode(code: string): AirportEntry | null {
    const entry = this.storage.get(
      `SELECT * FROM ${this.getTableName()} WHERE code = ?`,
      [code],
    );
    return entry;
  }

  public removeByCodeAndCityID(city_id: number, code: string): number {
    const { changes } = this.storage.run(
      `DELETE FROM ${this.getTableName()} WHERE code = ? and city_id = ?`,
      [code, city_id],
    );
    return changes;
  }
}
