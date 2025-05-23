import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ResponseTypes } from "@/lib/api/response";
import type { TokenData } from "@/types/features/token";

// Expand Request interface to add token data
declare global {
  namespace Express {
    interface Request {
      token_data: TokenData;
    }
  }
}

export async function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Skip several request types
  if (["OPTIONS", "HEAD", "PATCH"].includes(req.method)) {
    return next();
  }

  try {
    // Check auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json(ResponseTypes.error("user is not authorized"));
      return;
    }

    // Get token from header
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json(ResponseTypes.error("user is not authorized"));
      return;
    }

    // Verify token
    const decodedData = jwt.verify(
      token,
      req.dependencies.cfg.secret,
    ) as TokenData;

    // Check candidate entry exsistence
    const user = await req.dependencies.userService.getByID(decodedData.id);
    if (!user || user.login !== decodedData.login) {
      res.status(401).json(ResponseTypes.error("invalid token"));
      return;
    }

    // Add decoded data to request
    req.token_data = decodedData;

    next();
  } catch (e) {
    console.error(e);
    res.status(401).json(ResponseTypes.error("user is not authorized"));
    return;
  }
}
