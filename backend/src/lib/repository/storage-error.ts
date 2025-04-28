
export enum StorageErrorType {
	UNIQUE = "unique",
	CHECK = "check",
	RELATED = "has linked data",
	FOREIGN_KEY = "invalid foreign key",
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

function extractFieldFromSqliteErrorMessage(message: string) : string | null {
	try {
		return message.split(":")[1].slice(1);
	} catch (err) {
		return null;
	}
}

export function processStorageError(_err: unknown): StorageError | unknown {
	if (!(_err instanceof Error)) return _err;

	const err = _err as Error;
	const uniqueMatch = err.message.includes("UNIQUE constraint failed");
	const checkMatch = err.message.includes("CHECK constraint failed") || err.message.includes("NOT NULL constraint failed");;
	const foreignKeyMatch = err.message.includes("FOREIGN KEY constraint failed");

	const field = extractFieldFromSqliteErrorMessage(err.message);
	if (uniqueMatch) {
		return new StorageError("this entry is not unique", field ?? "?", StorageErrorType.UNIQUE);
	} else if (checkMatch) {
		return new StorageError("field does not match format", field ?? "?", StorageErrorType.CHECK);
	} else if (foreignKeyMatch) {
		return new StorageError("foreign key refers to non-existent entity", field ?? "?", StorageErrorType.FOREIGN_KEY);
	}

	return _err;
}