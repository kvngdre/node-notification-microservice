import { inject, injectable } from "inversify";
import { SendNotificationCommand } from "./send-notification-command";
import { Result, ResultType } from "@shared-kernel/result";
import { INotificationRepository } from "@domain/notification/notification-repository-interface";
import { Notification } from "@domain/notification";
import { IPublisher } from "@application/abstractions/publisher";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface";
import { SendNotificationCommandValidator } from "./send-notification-command-validator";

@injectable()
export class SendNotificationCommandHandler implements IRequestHandler<
  SendNotificationCommand,
  string
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("SendNotificationCommandValidator")
    private readonly _validator: SendNotificationCommandValidator,
    @inject("NotificationPublisher")
    private readonly _notificationPublisher: IPublisher<Notification>
  ) {}

  public async handle(command: SendNotificationCommand): Promise<ResultType<string>> {
    const { isFailure, exception, value } = this._validator.validate(command);

    if (isFailure) return Result.failure(exception);

    const notification = new Notification(value.channel, JSON.stringify(value.data));
    await this._notificationRepository.save(notification);
    // await this._notificationPublisher.publish(notification);

    return Result.success("Notification sent successfully", notification.id);
  }
}
