import { inject, injectable } from "inversify";
import { GetNotificationsQuery } from "./get-notifications-query";
import { NotificationResponse } from "@application/notifications/notification-response";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notifications";
import { IRequestHandler } from "@shared-kernel/mediator/request-handler-interface";

@injectable()
export class GetNotificationsQueryHandler implements IRequestHandler<
  GetNotificationsQuery,
  NotificationResponse[]
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(query: GetNotificationsQuery): Promise<ResultType<NotificationResponse[]>> {
    const notifications = await this._notificationRepository.find({});

    if (notifications.length === 0) {
      return Result.failure(NotificationExceptions.NoMatchFound);
    }

    return Result.success("Notifications retrieved", NotificationResponse.fromMany(notifications));
  }
}
