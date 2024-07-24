import { container } from "tsyringe";
import { RequestLoggingMiddleware } from "./middleware";
import { AbstractMiddleware } from "./shared/types";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";

export function dependencyInjection() {
  registerInfrastructureServices();

  container.registerSingleton<AbstractMiddleware>(
    "RequestLoggingMiddleware",
    RequestLoggingMiddleware
  );
}

dependencyInjection();
