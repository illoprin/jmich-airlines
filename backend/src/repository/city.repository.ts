import type { CityEntry } from "../types/repository/city";
import type { CityDTO } from "../types/dto/city";
import { BaseRepository } from "../lib/repository/base.repository";
import { parseJSONArray } from "../lib/repository/parse";

export class CityRepository extends BaseRepository<CityEntry> {
  public getTableName(): string {
    return "city";
  }
  private getJSONFieldName(): string {
    return "city_json";
  }

  protected create(): void {
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL UNIQUE,
				image TEXT NOT NULL DEFAULT '/upload/city_default.jpg'
			)
			`,
      [],
    );

    this.storage.run(
      `--sql
				CREATE UNIQUE INDEX IF NOT EXISTS idx_city ON ${this.getTableName()}(name)
			`,
      [],
    );
  }

  private getDTOQuery(whereClause: string = ""): string {
    return `--sql
			select
				json_object(
					'id', city.id,
					'name', city.name,
					'image', city.image,
					'airports', (
						select
							json_group_array(
								json_object(
									'id', airport.id,
									'name', airport.name,
									'code', airport.code
								)
							)
							from airport
							where airport.city_id = city.id
					)
				) as ${this.getJSONFieldName()}
			from ${this.getTableName()}
			${whereClause}
		`;
  }

  public add({ name, image }: CityEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
				INSERT INTO ${this.getTableName()} (name, image) VALUES (?, ?)
			`,
      [name, image],
    );
    return lastID as bigint;
  }

  public getDTOByID(id: number): CityDTO | null {
    const whereClause = "WHERE city.id = ?";
    const rows = this.storage.get<any>(this.getDTOQuery(whereClause), [id]);
    if (!rows[this.getJSONFieldName()]) {
      return null;
    }
    return JSON.parse(rows[this.getJSONFieldName()]) as CityDTO;
  }

  public getDTOAll(): CityDTO[] | null {
    const rows = this.storage.all<any>(this.getDTOQuery(), []);
    if (!rows?.length) {
      return null;
    }
    const dtos: CityDTO[] = parseJSONArray<CityDTO>(
      rows,
      this.getJSONFieldName(),
    );
    return dtos;
  }

  public update(id: number, { name, image }: CityEntry): number {
    const { changes } = this.storage.run(
      `--sql
				UPDATE ${this.getTableName()} SET
					name = ?,
					image = ?
				WHERE
					id = ?
			`,
      [name, image, id],
    );
    return changes;
  }

  public getByName(name: string): CityEntry | null {
    const entry = this.storage.get<CityEntry>(
      `
			SELECT * FROM ${this.getTableName()} WHERE name = ?
		`,
      [name],
    );
    return entry;
  }
}
