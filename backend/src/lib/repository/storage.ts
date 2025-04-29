import sqlite from "better-sqlite3";
import type { RunResult, SqliteError } from "better-sqlite3";
import { processStorageError } from "./storage-error";

export class Storage {
	private db: sqlite.Database;
	constructor(storagePath: string) {
		this.db = sqlite(storagePath);
		this.db.pragma("foreign_keys = ON");
		this.db.pragma("journal_mode = WAL");
	}

	public get<T = any>(sql: string, params: any[]): T | null {
		const stmt: sqlite.Statement = this.db.prepare(sql);
		const runResult: any = stmt.get(params);
		if (runResult) {
			return runResult as T;
		}
		return null;
	}

	public all<T = any>(sql: string, params: any[]): T[] | null {
		const stmt: sqlite.Statement = this.db.prepare(sql);
		const runResult: any = stmt.all(params);
		if (runResult.length > 0) {
			return runResult as T[];
		}
		return null;
	}

	public run(
		sql: string,
		params: any[]
	): { lastID: number | bigint; changes: number } {
		try {
			const stmt: sqlite.Statement = this.db.prepare(sql);
			const { lastInsertRowid, changes }: RunResult = stmt.run(params);
			return { lastID: lastInsertRowid, changes };
		} catch (err) {
			console.log((err as Error).message);
			throw processStorageError(err);
		}
	}

	public close(): void {
		this.db.close();
	}
}
