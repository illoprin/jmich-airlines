import { body, ValidationChain } from "express-validator";
import { FILE_PATH_REGEX } from "../service/const";

export function applyOptionalFlag(
	validators: ValidationChain[],
	isOptional: boolean
): ValidationChain[] {
	return isOptional ? validators.map((v) => v.optional()) : validators;
}

export function getForeignKeyValidation(fieldName: string): ValidationChain {
	return body(fieldName)
		.isInt({ min: 1 })
		.withMessage(
			`${fieldName.replace(/[-_]/g, " ")} foreign key must be valid`
		);
}

export function getISO8601Validation(fieldName: string): ValidationChain {
	return body(fieldName)
		.isISO8601()
		.withMessage(`${fieldName.replace(/[-_]/g, " ")} must be iso8601 date`);
}

export function getFilepathValidation(fieldName: string): ValidationChain {
	return body(fieldName)
		.matches(FILE_PATH_REGEX)
		.withMessage("file path must be unix-style without hostname");
}
