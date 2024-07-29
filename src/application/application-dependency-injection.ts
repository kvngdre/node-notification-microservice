import { container, Lifecycle } from "tsyringe";
import { IRequestHandler } from "./abstractions/messaging";
import { NotificationResponse } from "./notification/notification-response";
import {
  CreateNotificationCommand,
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notification/commands/create";
import { AbstractValidator } from "@shared-kernel/abstract-validator";

export function registerApplicationServices() {
  container.register<IRequestHandler<CreateNotificationCommand, NotificationResponse>>(
    "CommandHandler",
    CreateNotificationCommandHandler,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );

  container.register<AbstractValidator<CreateNotificationCommand>>(
    "CreateNotificationCommandValidator",
    CreateNotificationCommandValidator,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
}
