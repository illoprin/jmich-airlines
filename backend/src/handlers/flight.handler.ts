import { Request, Response, Router } from "express";
import { checkValidation, ResponseTypes } from "../lib/api/response";
import type { FlightEntry, FlightStatus } from "../types/repository/flight";
import type { FlightSearchPayload } from "../types/handler/flight";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/repository/user";
import { processServiceError } from "../lib/api/process-error";
import { body, ValidationChain } from "express-validator";
import {
  applyOptionalFlag,
  getDateValidation,
  getForeignKeyValidation,
  getISO8601Validation,
} from "../lib/api/validation-chain";

export class FlightHandler {
  private static getChain(optional: boolean = false): ValidationChain[] {
    const validators: ValidationChain[] = [
      getForeignKeyValidation("departure_airport_id"),
      getForeignKeyValidation("arrival_airport_id"),
      getForeignKeyValidation("company_id"),
      getDateValidation("departure_date"),
      getDateValidation("arrival_date"),
      body("route_code")
        .isLength({ min: 4, max: 4 })
        .matches(/^[A-Z][0-9]{3}$/g)
        .withMessage("route code must satisfy pattern /[A-Z][0-9][0-9][0-9]/"),
      body("price")
        .isInt({ min: 1 })
        .withMessage("price must be positive number starting from 1"),
      body("seats_available")
        .isInt({ min: 0 })
        .withMessage("number of available seats must be positive number"),
    ];
    return applyOptionalFlag(validators, optional);
  }

  private static addFlight(req: Request, res: Response): void {
    if (!checkValidation(req, res)) return;
    try {
      const {
        departure_airport_id,
        departure_date,
        arrival_airport_id,
        arrival_date,
        route_code,
        price,
        seats_available,
        company_id,
      }: FlightEntry = req.body;
      req.dependencies.flightService.add({
        departure_airport_id,
        departure_date: new Date(departure_date),
        arrival_airport_id,
        arrival_date: new Date(arrival_date),
        route_code,
        company_id,
        price,
        seats_available,
      });
      res.status(201).send();
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static addRandomFlights(req: Request, res: Response): void {
    try {
      const { quantity, days, max_duration, max_price } = req.body;
      const airports = req.dependencies.cityService.getAllAirports();
      const companies = req.dependencies.companyService.getAllCompanies();
      const errs = req.dependencies.flightService.addRandom(
        quantity ?? 100,
        days ?? 30,
        max_duration ?? 5,
        max_price ?? 10_000,
        airports,
        companies,
      );
      res.send(ResponseTypes.ok({ errs }));
    } catch (err) {
      processServiceError(res, err);
      return;
    }
    return;
  }

  private static async updateFlight(
    req: Request,
    res: Response,
  ): Promise<void> {
    if (!checkValidation(req, res)) return;
    try {
      const id = parseInt(req.params.id);
      await req.dependencies.flightService.updateGeneral(id, req.body);
      res.status(204).send();
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static async deleteFlight(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await req.dependencies.flightService.removeByID(id);
      res.status(204).send();
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static searchFlights(req: Request, res: Response): void {
    try {
      const payload: FlightSearchPayload = req.body;
      // WARN: shitcode
      if (req.body.departure_date)
        payload.departure_date = new Date(req.body.departure_date as string);
      payload.max = parseInt(req.query.limit as string);
      payload.page = parseInt(req.query.page as string);
      const flights = req.dependencies.flightService.search(payload);
      res.json(ResponseTypes.ok({ flights }));
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static async getFlightByID(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const flight = await req.dependencies.flightService.getByID(id);
      res.json(ResponseTypes.ok({ flight }));
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static async updateFlightStatus(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const status: FlightStatus = req.body.status;
      await req.dependencies.flightService.updateStatus(id, status);
      res.status(204).send();
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static getAllFlights(req: Request, res: Response): void {
    try {
      const max = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 0;
      const status = ((req.params.status as string) ?? "active").toUpperCase();
      const flights = req.dependencies.flightService.getAll(max, page, status);
      res.json(ResponseTypes.ok({ flights }));
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  public static router(): Router {
    const router = Router();

    // Guest routes
    // NOTE: I use post method for search so that url can contain query params
    // PERF
    router.post("/search", this.searchFlights);
    // PERF
    router.post(
      "/random",
      [authorizationMiddleware, roleMiddleware(Roles.Admin)],
      this.addRandomFlights,
    );
    // PERF
    router.get("/all/:status", this.getAllFlights);
    // PERF
    router.get("/:id", this.getFlightByID);

    // Moderator routes
    // PERF
    router.post(
      "/",
      [authorizationMiddleware, roleMiddleware(Roles.Moderator)],
      this.getChain(),
      this.addFlight,
    );
    // PERF
    router.put(
      "/:id",
      [authorizationMiddleware, roleMiddleware(Roles.Moderator)],
      this.getChain(true),
      this.updateFlight,
    );
    // PERF
    router.put(
      "/:id/status",
      [authorizationMiddleware, roleMiddleware(Roles.Moderator)],
      this.updateFlightStatus,
    );

    // Admin routes
    // PERF
    router.delete(
      "/:id",
      [authorizationMiddleware, roleMiddleware(Roles.Admin)],
      this.deleteFlight,
    );

    return router;
  }
}
