import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@application/abstractions/messaging";
import { SendNotificationCommand } from "./send-notification-command";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository } from "@domain/notifications/notification-repository-interface";
import { AbstractValidator } from "@shared-kernel/abstract-validator";
import { Notification, NotificationExceptions, NotificationStatus } from "@domain/notifications";

@scoped(Lifecycle.ResolutionScoped)
export class SendNotificationCommandHandler implements IRequestHandler<SendNotificationCommand> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("SendNotificationCommandValidator")
    private readonly _sendNotificationCommandValidator: AbstractValidator<SendNotificationCommand>
  ) {}

  public async handle(command: SendNotificationCommand): Promise<ResultType> {
    const { isFailure, exception, value } =
      this._sendNotificationCommandValidator.validate(command);

    if (isFailure) {
      return Result.failure(exception);
    }

    const notification = new Notification(value.channel, JSON.stringify(value.data));

    this._notificationRepository.save(notification);

    // TODO: SEND NOTIFICATION...

    return Result.success("Notification queued successfully");
  }
}
