import { inject, Lifecycle, scoped } from "tsyringe";
import { SendNotificationCommand } from "./send-notification-command";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository } from "@domain/notifications/notification-repository-interface";
import { AbstractValidator } from "@shared-kernel/abstract-validator";
import { Notification } from "@domain/notifications";
import { IPublisher } from "@application/abstractions/publisher";
import { IRequestHandler } from "@infrastructure/mediator/request-handler-interface";

@scoped(Lifecycle.ResolutionScoped)
export class SendNotificationCommandHandler implements IRequestHandler<SendNotificationCommand> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("SendNotificationCommandValidator")
    private readonly _sendNotificationCommandValidator: AbstractValidator<SendNotificationCommand>,
    @inject("NotificationPublisher")
    private readonly _notificationPublisher: IPublisher<Notification>
  ) {}

  public async handle(command: SendNotificationCommand): Promise<ResultType> {
    const { isFailure, exception, value } =
      this._sendNotificationCommandValidator.validate(command);

    if (isFailure) {
      return Result.failure(exception);
    }

    const notification = new Notification(value.channel, JSON.stringify(value.data));

    await this._notificationRepository.save(notification);

    await this._notificationPublisher.publish(notification);

    return Result.success("Notification queued successfully");
  }
}
