import { Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@application/abstractions/messaging";
import { CreateNotificationCommand } from "./create-notification-command";
import { NotificationResponse } from "@application/notification/notification-response";
import { Result, ResultType } from "@shared-kernel/result";
import { Exception } from "@shared-kernel/exception";
import { Notification, NotificationChannel } from "@domain/notification";

@scoped(Lifecycle.ResolutionScoped)
export class CreateNotificationCommandHandler extends IRequestHandler<
  CreateNotificationCommand,
  NotificationResponse
> {
  public async handle(
    command: CreateNotificationCommand
  ): Promise<ResultType<NotificationResponse>> {
    if (command.channel === undefined) {
      return Result.failure(Exception.Unexpected);
    }

    return Result.success(
      "Notification created",
      NotificationResponse.from(new Notification(NotificationChannel.EMAIL, ""))
    );
  }
}
