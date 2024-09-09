import { inject, Lifecycle, scoped } from "tsyringe";
import { GetNotificationByIdQuery } from "./get-notification-by-id-query";
import { NotificationResponse } from "@application/notifications/notification-response";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notifications";
import { IRequestHandler } from "@infrastructure/mediator/request-handler-interface";

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
