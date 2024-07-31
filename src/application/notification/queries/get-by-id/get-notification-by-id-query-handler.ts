import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@application/abstractions/messaging";
import { GetNotificationByIdQuery } from "./get-notification-by-id-query";
import { NotificationResponse } from "@application/notification/notification-response";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notification";

@scoped(Lifecycle.ResolutionScoped)
export class GetNotificationByIdQueryHandler
  implements IRequestHandler<GetNotificationByIdQuery, NotificationResponse>
{
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(query: GetNotificationByIdQuery): Promise<ResultType<NotificationResponse>> {
    const notification = await this._notificationRepository.findById(query.notificationId);

    if (notification === null) {
      return Result.failure(NotificationExceptions.NotFound(query.notificationId));
    }

    return Result.success("Notification retrieved", NotificationResponse.from(notification));
  }
}
