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
import { CreateNotificationCommandHandler } from "@application/notification/commands/create";
import { Mediator } from "@infrastructure/mediator/mediator";
import { GetNotificationByIdQueryHandler } from "@application/notification/queries/get-by-id";
import { GetNotificationsQueryHandler } from "@application/notification/queries/get";
import { DeleteNotificationByIdCommandHandler } from "@application/notification/commands/delete-by-id";

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

  console.log("==>", { handlers: mediator.handlers });

  console.log("Service registration complete...");
}

// registerServices();
