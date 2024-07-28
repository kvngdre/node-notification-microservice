import { container } from "tsyringe";
import { RequestLoggingMiddleware, ResourceNotFoundMiddleware } from "./middleware";
import { AbstractMiddleware } from "./abstractions/types";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { GlobalErrorHandler } from "./global-error-handler";

export function dependencyInjection() {
  registerInfrastructureServices();

  container.registerSingleton<AbstractMiddleware>(
    "RequestLoggingMiddleware",
    RequestLoggingMiddleware
  );
  container.registerSingleton<AbstractMiddleware>(
    "ResourceNotFoundMiddleware",
    ResourceNotFoundMiddleware
  );
  container.registerSingleton("GlobalErrorHandler", GlobalErrorHandler);
}

dependencyInjection();
