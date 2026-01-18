import { DeleteNotificationCommand } from "./delete-notification-command";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository, NotificationExceptions } from "@domain/notification";
import { inject, injectable } from "inversify";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface";

@injectable()
export class DeleteNotificationCommandHandler implements IRequestHandler<
  DeleteNotificationCommand,
  void
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  public async handle(command: DeleteNotificationCommand): Promise<ResultType<void>> {
    const notification = await this._notificationRepository.findById(command.notificationId);

    if (!notification) return Result.failure(NotificationExceptions.NotFound);

    await this._notificationRepository.remove(notification);

    return Result.success<void>("Notification deleted");
  }
}
