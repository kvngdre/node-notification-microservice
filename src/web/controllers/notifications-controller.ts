import { type Request, type Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./base-controller";
import {
  CreateNotificationCommand,
  CreateNotificationRequest,
  CreateNotificationCommandHandler
} from "@application/notifications/commands/create";
import {
  SendNotificationCommand,
  SendNotificationRequest,
  SendNotificationCommandHandler
} from "@application/notifications/commands/send";
import {
  GetNotificationByIdQuery,
  GetNotificationByIdQueryHandler
} from "@application/notifications/queries/get-by-id";
import {
  DeleteNotificationByIdCommand,
  DeleteNotificationByIdCommandHandler
} from "@application/notifications/commands/delete";
import {
  GetNotificationsQuery,
  GetNotificationsQueryHandler
} from "@application/notifications/queries/get-many";

@injectable()
export default class NotificationsController extends BaseController {
  constructor(
    @inject("CreateNotificationCommandHandler")
    private readonly createHandler: CreateNotificationCommandHandler,

    @inject("SendNotificationCommandHandler")
    private readonly sendHandler: SendNotificationCommandHandler,

    @inject("GetNotificationByIdQueryHandler")
    private readonly getByIdHandler: GetNotificationByIdQueryHandler,

    @inject("GetNotificationsQueryHandler")
    private readonly getHandler: GetNotificationsQueryHandler,

    @inject("DeleteNotificationByIdCommandHandler")
    private readonly deleteHandler: DeleteNotificationByIdCommandHandler
  ) {
    super();
  }

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

    const result = await this.createHandler.handle(command);
    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  /** Handles sending a notification through the specified channel. */
  public sendNotification = async (
    req: Request<object, object, SendNotificationRequest>,
    res: Response
  ) => {
    const command = new SendNotificationCommand(req.body.channel, req.body.data);

    const result = await this.sendHandler.handle(command);
    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  /** Handles retrieving a notification by its ID. */
  public getNotificationById = async (req: Request<{ notificationId: string }>, res: Response) => {
    const query = new GetNotificationByIdQuery(req.params.notificationId);

    const result = await this.getByIdHandler.handle(query);
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

    const result = await this.getHandler.handle(query);
    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };

  /** Handles the deletion of a notification by its ID. */
  public deleteNotificationById = async (
    req: Request<{ notificationId: string }>,
    res: Response
  ) => {
    const command = new DeleteNotificationByIdCommand(req.params.notificationId);

    const result = await this.deleteHandler.handle(command);
    const { code, payload } = this.buildHttpResponse(result, res);

    return res.status(code).json(payload);
  };
}
