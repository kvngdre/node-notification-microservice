import { inject, injectable } from "inversify";
import { GetNotificationByIdQuery } from "./get-notification-by-id-query";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notification";
import { IRequestHandler } from "@shared-kernel/mediator/request-handler-interface";

@injectable()
export class GetNotificationByIdQueryHandler implements IRequestHandler<
  GetNotificationByIdQuery,
  NotificationResponseDTO
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(
    query: GetNotificationByIdQuery
  ): Promise<ResultType<NotificationResponseDTO>> {
    const notification = await this._notificationRepository.findById(query.notificationId);

    if (notification === null) {
      return Result.failure(NotificationExceptions.NotFound(query.notificationId));
    }

    return Result.success("Notification retrieved", NotificationResponseDTO.from(notification));
  }
}
