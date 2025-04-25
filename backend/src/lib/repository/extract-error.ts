/**
 * Extracts the field name from SQLite constraint error message
 * format: 'SqliteError: CHECK constraint failed: length(cvv) == 3'
 * @param message error message string
 * @returns field name inside parentheses or null if not found
 */
export function extractFieldFromLengthError(message: string): string | null {
	const match = message.match(/length\(([^)]+)\)/);
	return match?.[1] ?? null;
}

/**
 * Extracts field name from SQLite UNIQUE constraint error
 * @param errorMessage Error message string
 * @returns Field name after last dot or null if not found
 */
export function extractFieldFromUniqueError(errorMessage: string): string | null {
    const match = errorMessage.match(/UNIQUE constraint failed: [^.]*\.([^.\s]+)/);
    return match?.[1] ?? null;
}