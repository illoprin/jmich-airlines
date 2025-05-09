import { Response } from "express";
import {
	AuthorizationError,
	ForbiddenError,
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
	PaymentError,
	RelatedDataError,
} from "../service/errors";
import { ResponseTypes } from "./response";

export function processServiceError(res: Response, error: any): void {
	if (error instanceof NotFoundError) {
		res.status(404).json(ResponseTypes.error(error.message));
	} else if (error instanceof RelatedDataError) {
		res.status(405).json(ResponseTypes.error(error.message));
	} else if (error instanceof NotUniqueError) {
		res.status(409).json(ResponseTypes.error(error.message));
	} else if (error instanceof AuthorizationError) {
		res.status(401).json(ResponseTypes.error(error.message));
	} else if (error instanceof ForbiddenError) {
		res.status(403).json(ResponseTypes.error(error.message));
	} else if(error instanceof PaymentError) {
		res.status(402).json(ResponseTypes.error(error.message));
	} else if (error instanceof InvalidFieldError) {
		res.status(400).json(ResponseTypes.error(error.message));
	} else {
		console.log(error);
		res.status(500).json(ResponseTypes.internalError());
	}
}
