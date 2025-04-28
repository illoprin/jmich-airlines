export class InvalidFieldError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidField";
	}
}

export class RelatedDataError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "HasRelatedDataError";
	}
}

export class NotUniqueError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotUnique";
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthorizationError";
	}
}

export class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ForbiddenError"
	}
}