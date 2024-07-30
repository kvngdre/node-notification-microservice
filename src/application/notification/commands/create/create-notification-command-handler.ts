import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@application/abstractions/mediator";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationResponse } from "@application/notification/notification-response";
import { Result, ResultType } from "@shared-kernel/result";
import {
  INotificationRepository,
  Notification,
  NotificationChannel,
  NotificationExceptions,
  NotificationStatus
} from "@domain/notification";
import { AbstractValidator } from "@shared-kernel/abstract-validator";

@scoped(Lifecycle.ResolutionScoped)
export class CreateNotificationCommandHandler extends IRequestHandler<
  CreateNotificationCommand,
  NotificationResponse
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("CreateNotificationCommandValidator")
    private readonly _createNotificationCommandValidator: AbstractValidator<CreateNotificationCommand>
  ) {
    super();

    // this.mediator.registerHandler("CreateNotificationCommand", this);
  }

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

    const found = await this._notificationRepository.findById(notification.id);

    if (found === null) {
      return Result.failure(NotificationExceptions.NotFound(notification.id));
    }

    await this._notificationRepository.save(notification);

    return Result.success("Notification created", NotificationResponse.from(notification));
  }
}
