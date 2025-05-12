import { Request, Response } from "express";
import { validationResult } from "express-validator";

interface ServerResponse<T> {
  status: string;
  error?: string;
  message?: string;
  errors?: string[];
}

/**
 * Checks express validation results
 * Sends response if has validation errors
 * @param req - Request
 * @returns validation flag
 */
export function checkValidation(req: Request, res: Response): boolean {
  const vr = validationResult(req);
  if (vr.isEmpty()) {
    return true;
  }

  let errs: string[] = [];
  vr.array().map((err) => errs.push(err.msg));
  res.status(400).json(ResponseTypes.validationError(errs));
  return false;
}

export class ResponseTypes {
  public static ok<T>(payload: T): ServerResponse<T> {
    return {
      status: "OK",
      ...payload,
    };
  }

  public static error(message: string): ServerResponse<any> {
    return {
      status: "error",
      message,
    };
  }

  public static validationError(errors: string[]): ServerResponse<any> {
    return {
      status: "error",
      message: "some fields are invalid",
      errors,
    };
  }

  public static internalError(): ServerResponse<any> {
    return {
      status: "error",
      message: "unknown internal server error",
    };
  }
}
