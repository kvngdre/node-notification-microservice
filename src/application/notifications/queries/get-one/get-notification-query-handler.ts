import { inject, injectable } from "inversify";
import { GetNotificationQuery } from "./get-notification-query.js";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto.js";
import { Result, ResultType } from "@shared-kernel/result.js";
import { INotificationRepository, NotificationExceptions } from "@domain/notification/index.js";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface.js";

@injectable()
export class GetNotificationQueryHandler implements IRequestHandler<
  GetNotificationQuery,
  NotificationResponseDTO
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(query: GetNotificationQuery): Promise<ResultType<NotificationResponseDTO>> {
    const notification = await this._notificationRepository.findById(query.notificationId);

    if (!notification) return Result.failure(NotificationExceptions.NotFound);

    return Result.success("Notification retrieved", NotificationResponseDTO.from(notification));
  }
}
