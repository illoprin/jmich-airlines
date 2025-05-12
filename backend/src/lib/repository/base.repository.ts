import { Storage } from "./storage";

export interface Entry {
  id?: number;
}

export abstract class BaseRepository<T> {
  constructor(protected storage: Storage) {
    this.create();
  }
  public abstract getTableName(): string;

  /**
   * Create table in database
   */
  protected abstract create(): void;

  /**
   * Delete database entry
   * @param id - id of entry
   * @returns rows affected
   */
  public removeByID(id: number): number {
    const { changes } = this.storage.run(
      `DELETE FROM ${this.getTableName()} WHERE id = ?`,
      [id],
    );
    return changes;
  }

  /**
   *
   * @param id - id of entry
   * @returns template object or null, if nothing is found
   */
  public getByID(id: number): T | null {
    const entry = this.storage.get<T>(
      `SELECT * FROM ${this.getTableName()} WHERE id = ?`,
      [id],
    );
    return entry ? entry : null;
  }

  public getAll(): T[] | null {
    const entries = this.storage.all<T>(
      `SELECT * FROM ${this.getTableName()}`,
      [],
    );
    return entries ? entries : null;
  }
}
