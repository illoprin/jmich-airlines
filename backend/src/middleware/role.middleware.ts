import type { Request, Response, NextFunction } from "express";
import { ResponseTypes } from "../lib/api/response";
import type { MiddlewareFunc } from "../types/internal/middleware";

export function roleMiddleware(roles: number): MiddlewareFunc {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip several request types
    if (["OPTIONS", "HEAD", "PATCH"].includes(req.method)) {
      next();
    }

    // Get role from token decoded data
    const { role } = req.token_data;

    console.log("User role %d\nRequired role %d", role, roles);

    // Role of user < accessible_role (for e.g. access role - 1, user role - 0)
    if (role < (roles as number)) {
      res.status(403).json(ResponseTypes.error("access denied"));
      return;
    }
    next();
  };
}
