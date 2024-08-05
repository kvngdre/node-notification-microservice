import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@application/abstractions/messaging";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationResponse } from "@application/notifications/notification-response";
import { Result, ResultType, AbstractValidator } from "@shared-kernel/index";
import {
  INotificationRepository,
  Notification,
  NotificationChannel,
  // NotificationExceptions,
  NotificationStatus
} from "@domain/notifications";

@scoped(Lifecycle.ResolutionScoped)
export class CreateNotificationCommandHandler
  implements IRequestHandler<CreateNotificationCommand, NotificationResponse>
{
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("CreateNotificationCommandValidator")
    private readonly _createNotificationCommandValidator: AbstractValidator<CreateNotificationCommand>
  ) {}

  public async handle(
    command: CreateNotificationCommand
  ): Promise<ResultType<NotificationResponse>> {
    const { isFailure, exception, value } =
      this._createNotificationCommandValidator.validate(command);

    if (isFailure) {
      return Result.failure(exception);
    }

    const notification = new Notification(
      value.channel as NotificationChannel,
      value.data,
      value.status as NotificationStatus,
      value.retryCount
    );

    await this._notificationRepository.save(notification);

    return Result.success("Notification created", NotificationResponse.from(notification));
  }
}
