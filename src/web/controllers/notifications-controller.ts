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
import {
  SendNotificationCommand,
  SendNotificationRequest
} from "@application/notifications/commands/send";

@scoped(Lifecycle.ResolutionScoped)
export class NotificationsController extends BaseController {

  /** Handles the creation of a new notification. */
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

  /** Handles retrieving a notification by its ID. */
  public getNotificationById = async (req: Request<{ notificationId: string }>, res: Response) => {
    const query = new GetNotificationByIdQuery(req.params.notificationId);

    const result = await this.mediator.send<NotificationResponse>(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  /** Handles retrieving a list of notifications with optional filters. */
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

  /** Handles the deletion of a notification by its ID. */
  public deleteNotificationById = async (
    req: Request<{ notificationId: string }>,
    res: Response
  ) => {
    const command = new DeleteNotificationByIdCommand(req.params.notificationId);

    const result = await this.mediator.send(command);
    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  /** Handles sending a notification through the specified channel. */
  public sendNotification = async (
    req: Request<object, object, SendNotificationRequest>,
    res: Response
  ) => {
    const command = new SendNotificationCommand(req.body.channel, req.body.data);

    const result = await this.mediator.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };
}
