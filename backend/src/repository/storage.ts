import sqlite from "better-sqlite3";
import type { RunResult } from "better-sqlite3";

export enum StorageErrorType {
	UNIQUE = "unique",
	CHECK = "check",
}

export interface StorageError {
	message: string;
	field: string;
	type: StorageErrorType;
}

function processStorageError(_err: unknown): StorageError | unknown {
	if (!(_err instanceof Error)) return _err;

	const err = _err as Error;
	const unique_match = err.message.match(/UNIQUE constraint failed: (\w+)/);
	const check_match = err.message.match(/CHECK constraint failed: (\w+)/);

	if (unique_match) {
		return {
			message: "not unique",
			field: unique_match[1],
			type: StorageErrorType.UNIQUE,
		} as StorageError;
	} else if (check_match) {
		return {
			message: "invalid field",
			field: check_match[1],
			type: StorageErrorType.CHECK,
		} as StorageError;
	}

	return _err;
}

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
		if (runResult) {
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
			throw processStorageError(err);
		}
	}

	public close(): void {
		this.db.close();
	}
}
