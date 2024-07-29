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

  console.log("==>", { handlers: mediator.handlers });

  console.log("Service registration complete...");
}

// registerServices();
