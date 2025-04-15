interface ServerResponse<T> {
	status: string;
	error?: string;
	message?: string;
}

export class ResponseTypes {
	public static ok<T>(payload : T): ServerResponse<T> {
		return {
			status: "OK",
			...payload
		};
	}

	public static error(message: string): ServerResponse<any> {
		return {
			status: "error",
			message,
		};
	}

	public static internalError(): ServerResponse<any> {
		return {
			status: "error",
			message: "unknown internal server error"
		};
	}
}