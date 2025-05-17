import { Request, Response, Router } from "express";
import { processServiceError } from "@/lib/api/process-error";
import { ResponseTypes } from "@/lib/api/response";
import { NotificationEntry } from "@/types/repository/notification";
import { body, ValidationChain } from "express-validator";
import {
  FILE_PATH_REGEX,
  SOME_WORDS_SINGLE_SPACE_REGEX,
} from "../lib/service/const";
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { Roles } from "../types/repository/user";

export class NotificationHandler {
  private static getChain(): ValidationChain[] {
    return [
      body("body")
        .matches(SOME_WORDS_SINGLE_SPACE_REGEX)
        .withMessage("body can contain only allowed symbols"),
      body("title")
        .matches(SOME_WORDS_SINGLE_SPACE_REGEX)
        .withMessage("title can contain only allowed symbols"),
      body("image")
        .matches(FILE_PATH_REGEX)
        .withMessage("image must be valid file path"),
    ];
  }

  private static async getNotificationsForUser(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userID = req.token_data.id;
      const notifications =
        await req.dependencies.notificationService.getByUserID(userID);
      res.json(ResponseTypes.ok({ notifications }));
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  private static async pushNotificationToUser(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userID = parseInt(req.params.user_id);
      const notification: NotificationEntry = {
        id: Date.now(),
        title: req.body.title,
        body: req.body.body,
        image: req.body.image,
      };
      await req.dependencies.notificationService.push(notification, userID);
      res.status(201).send();
    } catch (err) {
      processServiceError(res, err);
      return;
    }
  }

  public static router(): Router {
    const router = Router();
    // PERF
    router.get("/", authorizationMiddleware, this.getNotificationsForUser);
    // PERF
    router.post(
      "/:user_id",
      [authorizationMiddleware, roleMiddleware(Roles.Moderator)],
      this.getChain(),
      this.pushNotificationToUser,
    );
    return router;
  }
}
