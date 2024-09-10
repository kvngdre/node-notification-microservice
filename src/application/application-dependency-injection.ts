import { container, Lifecycle } from "tsyringe";
import { NotificationResponse } from "./notifications/notification-response";
import {
  CreateNotificationCommand,
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notifications/commands/create";
import { AbstractValidator } from "@shared-kernel/abstract-validator";
import {
  GetNotificationByIdQuery,
  GetNotificationByIdQueryHandler
} from "./notifications/queries/get-by-id";
import { GetNotificationsQuery, GetNotificationsQueryHandler } from "./notifications/queries/get";
import {
  DeleteNotificationByIdCommand,
  DeleteNotificationByIdCommandHandler,
  DeleteNotificationByIdCommandValidator
} from "./notifications/commands/delete-by-id";
import {
  SendNotificationCommand,
  SendNotificationCommandHandler,
  SendNotificationCommandValidator
} from "./notifications/commands/send";
import { IRequestHandler } from "@infrastructure/mediator/request-handler-interface";

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
  container.register<IRequestHandler<SendNotificationCommand>>(
    "CommandHandler",
    SendNotificationCommandHandler,
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
  container.register<AbstractValidator<SendNotificationCommand>>(
    "SendNotificationCommandValidator",
    SendNotificationCommandValidator,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
  container.register<AbstractValidator<DeleteNotificationByIdCommand>>(
    "DeleteNotificationByIdCommandValidator",
    DeleteNotificationByIdCommandValidator,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
}
