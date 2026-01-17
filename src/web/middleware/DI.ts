import { AbstractErrorMiddleware, AbstractMiddleware } from "@web/abstractions/types";
import { container } from "tsyringe";
import { ErrorHandlingMiddleware } from "./error-handling-middleware";
import { RequestLoggingMiddleware } from "./request-logging.middleware";
import { ResourceNotFoundMiddleware } from "./resource-not-found-middleware";

export function registerMiddleware() {
  container.registerSingleton<AbstractMiddleware>(RequestLoggingMiddleware);
  container.registerSingleton<AbstractMiddleware>(ResourceNotFoundMiddleware);
  container.registerSingleton<AbstractErrorMiddleware>(
    "ErrorHandlingMiddleware",
    ErrorHandlingMiddleware
  );
}
