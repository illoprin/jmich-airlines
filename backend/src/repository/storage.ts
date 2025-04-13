import sqlite from "better-sqlite3"
import type { RunResult } from "better-sqlite3"

export class Storage {
	private db: sqlite.Database;
	constructor(storagePath: string) {
		try {
			this.db = sqlite(storagePath);
		} catch (err) {
			throw err;
		}
	}
	
	public get(sql: string, params: any[]): Object | unknown {
		try {
			const stmt: sqlite.Statement = this.db.prepare(sql);
			const runResult: sqlite.RunResult | unknown = stmt.get(params);
			return runResult;
		} catch (err) {
			// WARN: naitive methods to process sqlite errors is not found
			throw err;
		}
	}

	public all(sql: string, params: any[]): Object[] | unknown {
		try {
			const stmt: sqlite.Statement = this.db.prepare(sql);
			const runResult: sqlite.RunResult | unknown = stmt.all(params);
			return runResult;
		} catch (err) {
			// WARN: naitive methods to process sqlite errors is not found
			throw err;
		}
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
			// WARN: naitive methods to process sqlite errors is not found
			throw err;
		}
	}

	public close(): void {
		this.db.close();
	}
}