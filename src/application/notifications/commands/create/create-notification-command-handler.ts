import { inject, injectable } from "inversify";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto";
import { Result, ResultType } from "@shared-kernel/index";
import { INotificationRepository, Notification } from "@domain/notification";
import { IRequestHandler } from "@application/abstractions/messaging/request-handler-interface";
import { CreateNotificationCommandValidator } from "./create-notification-command-validator";

@injectable()
export class CreateNotificationCommandHandler implements IRequestHandler<
  CreateNotificationCommand,
  NotificationResponseDTO
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("CreateNotificationCommandValidator")
    private readonly _validator: CreateNotificationCommandValidator
  ) {}

  public async handle(
    command: CreateNotificationCommand
  ): Promise<ResultType<NotificationResponseDTO>> {
    const { isFailure, exception, value } = this._validator.validate(command);

    if (isFailure) return Result.failure(exception);

    const notification = new Notification(
      value.channel,
      value.data,
      value.status,
      value.retryCount
    );

    await this._notificationRepository.save(notification);

    return Result.success("Notification created", NotificationResponseDTO.from(notification));
  }
}
