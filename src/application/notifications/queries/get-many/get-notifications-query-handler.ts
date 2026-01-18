import { inject, injectable } from "inversify";
import { GetNotificationsQuery } from "./get-notifications-query.js";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto.js";
import { Result, ResultType } from "@shared-kernel/result.js";
import { INotificationRepository, NotificationExceptions } from "@domain/notification/index.js";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface.js";

@injectable()
export class GetNotificationsQueryHandler implements IRequestHandler<
  GetNotificationsQuery,
  NotificationResponseDTO[]
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(
    query: GetNotificationsQuery
  ): Promise<ResultType<NotificationResponseDTO[]>> {
    const notifications = await this._notificationRepository.find(query);

    if (notifications.length === 0) {
      return Result.failure(NotificationExceptions.NoMatchFound);
    }

    return Result.success(
      "Notifications retrieved",
      NotificationResponseDTO.fromMany(notifications)
    );
  }
}
