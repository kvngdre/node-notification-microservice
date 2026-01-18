import { inject, injectable } from "inversify";
import { GetNotificationsQuery } from "./get-notifications-query";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notification";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface";

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
    const notifications = await this._notificationRepository.find({});

    if (notifications.length === 0) {
      return Result.failure(NotificationExceptions.NoMatchFound);
    }

    return Result.success(
      "Notifications retrieved",
      NotificationResponseDTO.fromMany(notifications)
    );
  }
}
