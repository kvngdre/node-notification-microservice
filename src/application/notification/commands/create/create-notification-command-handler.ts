import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@application/abstractions/messaging";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationResponse } from "@application/notification/notification-response";
import { Result, ResultType, AbstractValidator, IDateTimeProvider } from "@shared-kernel/index";
import {
  INotificationRepository,
  Notification,
  NotificationChannel,
  // NotificationExceptions,
  NotificationStatus
} from "@domain/notification";

@scoped(Lifecycle.ResolutionScoped)
export class CreateNotificationCommandHandler
  implements IRequestHandler<CreateNotificationCommand, NotificationResponse>
{
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("CreateNotificationCommandValidator")
    private readonly _createNotificationCommandValidator: AbstractValidator<CreateNotificationCommand>,
    @inject("DateTimeProvider") private readonly _dateTimeProvider: IDateTimeProvider
  ) {}

  public async handle(
    command: CreateNotificationCommand
  ): Promise<ResultType<NotificationResponse>> {
    const { isFailure, exception, value } =
      this._createNotificationCommandValidator.validate(command);

    if (isFailure) {
      return Result.failure(exception);
    }
    const a = this._dateTimeProvider.utcNow();
    const b = this._dateTimeProvider.utcNow();
    console.log(a);
    console.log(b);

    const notification = new Notification(
      value.channel as NotificationChannel,
      value.data,
      this._dateTimeProvider.utcNow(),
      this._dateTimeProvider.utcNow(),
      value.status as NotificationStatus,
      value.retryCount
    );

    await this._notificationRepository.save(notification);

    return Result.success("Notification created", NotificationResponse.from(notification));
  }
}
