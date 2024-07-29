import { type Request, type Response } from "express";
import {
  CreateNotificationCommand,
  CreateNotificationRequest
} from "@application/notification/commands/create";
import { Result, ResultType } from "@shared-kernel/result";
import { BaseController } from "./base-controller";
import { NotificationResponse } from "@application/notification/notification-response";

export class NotificationsController extends BaseController {
  public createNotification = async (
    req: Request<object, object, CreateNotificationRequest>,
    res: Response
  ) => {
    const command = new CreateNotificationCommand(req.body.channel, req.body.data);

    const result = await this.mediator.send<Result<NotificationResponse>>(command);

    const { code, payload } = this.buildHttpResponse(result);

    if (payload.success) {
      result.exception;
      payload;
    }

    return res.status(code).json(payload);
  };
}
