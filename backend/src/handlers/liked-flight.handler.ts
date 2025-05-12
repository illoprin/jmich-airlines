import { Request, Response, Router } from "express";
import { processServiceError } from "../lib/api/process-error";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { ResponseTypes } from "../lib/api/response";

export class LikedFlightHandler {
  private static async getUserLikedFlights(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userID = req.token_data.id;
      const flights =
        await req.dependencies.likedFlightService.getUserLikedFlights(userID);
      res.json(ResponseTypes.ok({ flights }));
    } catch (err) {
      processServiceError(res, err);
    }
  }

  private static async likeFlight(req: Request, res: Response): Promise<void> {
    try {
      const userID = req.token_data.id;
      const flightID = parseInt(req.params.flight_id);
      await req.dependencies.likedFlightService.likeFlight(userID, flightID);
      res.status(204).send();
    } catch (err) {
      processServiceError(res, err);
    }
  }

  private static async unlikeFlight(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userID = req.token_data.id;
      const flightID = parseInt(req.params.flight_id);
      await req.dependencies.likedFlightService.unlikeFlight(userID, flightID);
      res.status(204).send();
    } catch (err) {
      processServiceError(res, err);
    }
  }

  public static router(): Router {
    const router = Router();

    // PERF
    router.post("/:flight_id", authorizationMiddleware, this.likeFlight);
    // PERF
    router.get("/", authorizationMiddleware, this.getUserLikedFlights);
    // PERF
    router.delete("/:flight_id", authorizationMiddleware, this.unlikeFlight);

    return router;
  }
}
