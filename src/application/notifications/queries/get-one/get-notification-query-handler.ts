import { inject, injectable } from "inversify";
import { GetNotificationQuery } from "./get-notification-query";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notification";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface";

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
