import { container, Lifecycle } from "tsyringe";
import {
  ErrorHandlingMiddleware,
  RequestLoggingMiddleware,
  ResourceNotFoundMiddleware
} from "./middleware";
import { AbstractErrorMiddleware, AbstractMiddleware } from "./abstractions/types";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { registerApplicationServices } from "@application/application-dependency-injection";
import { GlobalErrorHandler } from "./infrastructure/global-error-handler";
import { CreateNotificationCommandHandler } from "@application/notifications/commands/create";
import { Mediator } from "@infrastructure/mediator/mediator";
import { GetNotificationByIdQueryHandler } from "@application/notifications/queries/get-by-id";
import { GetNotificationsQueryHandler } from "@application/notifications/queries/get";
import { DeleteNotificationByIdCommandHandler } from "@application/notifications/commands/delete-by-id";
import { SendNotificationCommandHandler } from "@application/notifications/commands/send";

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();

  container.registerSingleton<AbstractMiddleware>(RequestLoggingMiddleware);
  container.registerSingleton<AbstractMiddleware>(ResourceNotFoundMiddleware);
  container.register<AbstractErrorMiddleware>("ErrorHandlingMiddleware", ErrorHandlingMiddleware, {
    lifecycle: Lifecycle.ResolutionScoped
  });
  container.registerSingleton("GlobalErrorHandler", GlobalErrorHandler);

  const mediator = container.resolve(Mediator);

  console.log("==>", { handlers: mediator.handlers });

  mediator.registerHandler(
    "CreateNotificationCommand",
    container.resolve(CreateNotificationCommandHandler)
  );
  mediator.registerHandler(
    "GetNotificationByIdQuery",
    container.resolve(GetNotificationByIdQueryHandler)
  );
  mediator.registerHandler(
    "GetNotificationsQuery",
    container.resolve(GetNotificationsQueryHandler)
  );
  mediator.registerHandler(
    "DeleteNotificationByIdCommand",
    container.resolve(DeleteNotificationByIdCommandHandler)
  );
  mediator.registerHandler(
    "SendNotificationCommandHandler",
    container.resolve(SendNotificationCommandHandler)
  );

  console.log("==>", { handlers: mediator.handlers.size });

  // mediator.registerHandlers();

  console.log("Service registration complete...");
}

// registerServices();
