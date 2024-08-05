import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import {
  CreateNotificationCommand,
  CreateNotificationRequest
} from "@application/notifications/commands/create";
import { BaseController } from "./base-controller";
import { NotificationResponse } from "@application/notifications/notification-response";
import { GetNotificationByIdQuery } from "@application/notifications/queries/get-by-id";
import { GetNotificationsQuery } from "@application/notifications/queries/get";
import { DeleteNotificationByIdCommand } from "@application/notifications/commands/delete-by-id";

@scoped(Lifecycle.ResolutionScoped)
export class NotificationsController extends BaseController {
  public createNotification = async (
    req: Request<object, object, CreateNotificationRequest>,
    res: Response
  ) => {
    const command = new CreateNotificationCommand(
      req.body.channel,
      req.body.data,
      req.body.retryCount,
      req.body.status
    );

    const result = await this.mediator.send<NotificationResponse>(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  public getNotificationById = async (req: Request<{ notificationId: string }>, res: Response) => {
    const query = new GetNotificationByIdQuery(req.params.notificationId);

    const result = await this.mediator.send<NotificationResponse>(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  public getNotifications = async (
    req: Request<
      object,
      object,
      object,
      { limit?: string; offset?: string; status?: string; channel?: string }
    >,
    res: Response
  ) => {
    const query = new GetNotificationsQuery(
      parseInt(req.query.limit as string, 10),
      parseInt(req.query.offset as string, 10),
      req.query.channel,
      req.query.status
    );

    const result = await this.mediator.send<NotificationResponse>(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  public deleteNotificationById = async (
    req: Request<{ notificationId: string }>,
    res: Response
  ) => {
    const command = new DeleteNotificationByIdCommand(req.params.notificationId);

    const result = await this.mediator.send<NotificationResponse>(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };
}
