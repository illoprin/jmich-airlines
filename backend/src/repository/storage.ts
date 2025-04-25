import sqlite from "better-sqlite3";
import type { RunResult } from "better-sqlite3";
import { extractFieldFromLengthError, extractFieldFromUniqueError } from "../lib/repository/extract-error";

export enum StorageErrorType {
	UNIQUE = "unique",
	CHECK = "check",
}

export class StorageError extends Error {
	constructor(
		message: string,
		public field: string,
		public type: StorageErrorType
	) {
		super(message);
	}
}

function processStorageError(_err: unknown): StorageError | unknown {
	if (!(_err instanceof Error)) return _err;

	const err = _err as Error;
	const unique_match = err.message.match(/UNIQUE constraint failed: (\w+)/);
	const check_match = err.message.match(/CHECK constraint failed: (\w+)/);

	if (unique_match) {
		const field = extractFieldFromUniqueError(err.message);
		return new StorageError("not unique", field ?? "?", StorageErrorType.UNIQUE);
	} else if (check_match) {
		const field = extractFieldFromLengthError(err.message);
		return new StorageError("invalid field", field ?? "?", StorageErrorType.CHECK);
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
			console.log(err);
			throw processStorageError(err);
		}
	}

	public close(): void {
		this.db.close();
	}
}
