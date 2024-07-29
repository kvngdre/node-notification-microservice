import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import {
  CreateNotificationCommand,
  CreateNotificationRequest
} from "@application/notification/commands/create";
import { BaseController } from "./base-controller";
import { NotificationResponse } from "@application/notification/notification-response";

@scoped(Lifecycle.ResolutionScoped)
export class NotificationsController extends BaseController {
  public createNotification = async (
    req: Request<object, object, CreateNotificationRequest>,
    res: Response
  ) => {
    const command = new CreateNotificationCommand(req.body.channel, req.body.data);

    const result = await this.mediator.send<NotificationResponse>(command);

    const { code, payload } = this.buildHttpResponse(result);

    return res.status(code).json(payload);
  };
}
