import { inject, injectable } from "inversify";
import { SendNotificationCommand } from "./send-notification-command";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository } from "@domain/notification/notification-repository-interface";
import { AbstractValidator } from "@shared-kernel/abstract-validator";
import { Notification } from "@domain/notification";
import { IPublisher } from "@application/abstractions/publisher";
import { IRequestHandler } from "@shared-kernel/mediator/request-handler-interface";

@injectable()
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
