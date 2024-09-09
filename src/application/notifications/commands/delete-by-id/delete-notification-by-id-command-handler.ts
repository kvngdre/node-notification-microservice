import { inject, Lifecycle, scoped } from "tsyringe";
import { DeleteNotificationByIdCommand } from "./delete-notification-by-id-command";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notifications";
import { IRequestHandler } from "@infrastructure/mediator/request-handler-interface";

@scoped(Lifecycle.ResolutionScoped)
export class DeleteNotificationByIdCommandHandler
  implements IRequestHandler<DeleteNotificationByIdCommand>
{
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(command: DeleteNotificationByIdCommand): Promise<ResultType> {
    const notification = await this._notificationRepository.findById(command.notificationId);

    if (notification === null) {
      return Result.failure(NotificationExceptions.NotFound(command.notificationId));
    }

    await this._notificationRepository.remove(notification);

    return Result.success("Notification deleted");
  }
}
