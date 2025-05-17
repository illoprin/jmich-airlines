import { DiscountEntry } from "@/types/repository/discount";
import { BaseRepository } from "@/lib/repository/base.repository";

export class DiscountRepository extends BaseRepository<DiscountEntry> {
  public getTableName(): string {
    return "discount";
  }

  protected create(): void {
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				code TEXT NOT NULL UNIQUE CHECK(length(code) < 64),
				amount REAL NOT NULL CHECK(amount BETWEEN 0 AND 1),
				valid_until DATE NOT NULL
					DEFAULT (date('now', '+20 days'))
			)
			`,
      [],
    );

    this.storage.run(
      `--sql
			CREATE UNIQUE INDEX IF NOT EXISTS idx_disount_code ON ${this.getTableName()}(code)
		`,
      [],
    );
  }

  public add({ code, amount, valid_until }: DiscountEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
				INSERT INTO ${this.getTableName()}(code, amount, valid_until)
				VALUES
					(?, ?, ?)
			`,
      [code, amount, valid_until.toISOString()],
    );
    return lastID as bigint;
  }

  public getAllValid(): DiscountEntry[] | null {
    const sql = `--sql
			SELECT *
			FROM
				${this.getTableName()}
			WHERE
				date(valid_until) > date('now')
		`;
    const discounts = this.storage.all<DiscountEntry>(sql, []);
    return discounts;
  }

  public removeInvalid(): number {
    const sql = `--sql
			DELETE FROM ${this.getTableName()}
			WHERE
				date(valid_until) < date(CURRENT_TIMESTAMP)
		`;
    const { changes } = this.storage.run(sql, []);
    return changes;
  }

  public removeByCode(code: string): number {
    const sql = `--sql
			DELETE FROM ${this.getTableName()}
			WHERE
				code = ?
		`;

    const { changes } = this.storage.run(sql, [code]);
    return changes;
  }

  public getByCode(code: string): DiscountEntry | null {
    const entry = this.storage.get(
      `--sql
			SELECT * FROM ${this.getTableName()} WHERE code = ?
		`,
      [code],
    );
    return entry;
  }
}
