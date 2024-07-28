import { container, Lifecycle } from "tsyringe";
import {
  ErrorHandlingMiddleware,
  RequestLoggingMiddleware,
  ResourceNotFoundMiddleware
} from "./middleware";
import { AbstractErrorMiddleware, AbstractMiddleware } from "./abstractions/types";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { GlobalErrorHandler } from "./infrastructure/global-error-handler";

export function registerServices() {
  registerInfrastructureServices();

  container.registerSingleton<AbstractMiddleware>(
    "RequestLoggingMiddleware",
    RequestLoggingMiddleware
  );
  container.registerSingleton<AbstractMiddleware>(
    "ResourceNotFoundMiddleware",
    ResourceNotFoundMiddleware
  );
  container.register<AbstractErrorMiddleware>("ErrorHandlingMiddleware", ErrorHandlingMiddleware, {
    lifecycle: Lifecycle.ResolutionScoped
  });
  container.registerSingleton("GlobalErrorHandler", GlobalErrorHandler);
}

registerServices();
