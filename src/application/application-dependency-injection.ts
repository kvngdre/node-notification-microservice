import { container, Lifecycle } from "tsyringe";
import { IRequestHandler } from "./abstractions/messaging";
import { NotificationResponse } from "./notification/notification-response";
import {
  CreateNotificationCommand,
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notification/commands/create";
import { AbstractValidator } from "@shared-kernel/abstract-validator";
import {
  GetNotificationByIdQuery,
  GetNotificationByIdQueryHandler
} from "./notification/queries/get-by-id";
import { GetNotificationsQuery, GetNotificationsQueryHandler } from "./notification/queries/get";
import {
  DeleteNotificationByIdCommand,
  DeleteNotificationByIdCommandHandler
} from "./notification/commands/delete-by-id";

export function registerApplicationServices() {
  container.register<IRequestHandler<CreateNotificationCommand, NotificationResponse>>(
    "CommandHandler",
    CreateNotificationCommandHandler,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
  container.register<IRequestHandler<GetNotificationByIdQuery, NotificationResponse>>(
    "CommandHandler",
    GetNotificationByIdQueryHandler,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
  container.register<IRequestHandler<GetNotificationsQuery, NotificationResponse[]>>(
    "CommandHandler",
    GetNotificationsQueryHandler,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
  container.register<IRequestHandler<DeleteNotificationByIdCommand>>(
    "CommandHandler",
    DeleteNotificationByIdCommandHandler,
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
