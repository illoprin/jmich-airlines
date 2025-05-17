import type { BaggageRuleEntry } from "@/types/repository/company";
import { BaseRepository } from "@/lib/repository/base.repository";

export class BaggageRuleRepository extends BaseRepository<BaggageRuleEntry> {
  public getTableName(): string {
    return "baggage_rule";
  }

  protected create(): void {
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
				id INTEGER PRIMARY KEY,
				max_free_weight INTEGER NOT NULL,
				price_per_kg INTEGER NOT NULL
			);
		`,
      [],
    );
  }

  public add({ max_free_weight, price_per_kg }: BaggageRuleEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
			INSERT INTO ${this.getTableName()}
				(max_free_weight, price_per_kg)
			VALUES
				(?, ?)
		`,
      [max_free_weight, price_per_kg],
    );
    return lastID as bigint;
  }

  public update(
    id: number,
    { max_free_weight, price_per_kg }: BaggageRuleEntry,
  ): number {
    const { changes } = this.storage.run(
      `--sql
			UPDATE ${this.getTableName()} SET
				max_free_weight = ?,
				price_per_kg = ?,
			WHERE
				id = ?
		`,
      [max_free_weight, price_per_kg, id],
    );
    return changes;
  }
}
