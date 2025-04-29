import { Response } from "express";
import { StorageError } from "../repository/storage-error";
import { AuthorizationError, ForbiddenError, NotFoundError, NotUniqueError, RelatedDataError } from "../../types/service.type";
import { ResponseTypes } from "./response";

export function processServiceError(res: Response, error: any): void {
	if (error instanceof StorageError) {
		if (error instanceof NotFoundError) {
			res.status(404).json(ResponseTypes.error(error.message));
		} else if (error instanceof RelatedDataError) {
			res.status(405).json(ResponseTypes.error(error.message));
		} else if(error instanceof NotUniqueError) {
			res.status(409).json(error.message);
		} else if (error instanceof AuthorizationError) {
			res.status(401).json(error.message);
		} else if (error instanceof ForbiddenError) {
			res.status(403).json(error.message);
		} else {
			res.status(500).json(ResponseTypes.internalError());
		}
	}
}
