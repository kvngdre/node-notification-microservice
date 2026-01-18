import { inject, injectable } from "inversify";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationResponseDTO } from "@application/notifications/shared/notification-response-dto";
import { Result, ResultType, AbstractValidator } from "@shared-kernel/index";
import {
  INotificationRepository,
  Notification,
  NotificationChannel,
  // NotificationExceptions,
  NotificationStatus
} from "@domain/notification";
import { IRequestHandler } from "@shared-kernel/mediator";

@injectable()
export class CreateNotificationCommandHandler implements IRequestHandler<
  CreateNotificationCommand,
  NotificationResponseDTO
> {
  constructor(
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("CreateNotificationCommandValidator")
    private readonly _createNotificationCommandValidator: AbstractValidator<CreateNotificationCommand>
  ) {}

  public async handle(
    command: CreateNotificationCommand
  ): Promise<ResultType<NotificationResponseDTO>> {
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

    return Result.success("Notification created", NotificationResponseDTO.from(notification));
  }
}
