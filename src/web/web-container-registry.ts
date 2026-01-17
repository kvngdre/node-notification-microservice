import { container } from "tsyringe";
import { AbstractErrorMiddleware, AbstractMiddleware } from "@web/abstractions/types";
import { ErrorHandlingMiddleware } from "./middleware/error-handling-middleware";
import { RequestLoggingMiddleware } from "./middleware/request-logging.middleware";
import { ResourceNotFoundMiddleware } from "./middleware/resource-not-found-middleware";

export function registerWebServices() {
  container.registerSingleton<AbstractMiddleware>(RequestLoggingMiddleware);
  container.registerSingleton<AbstractMiddleware>(ResourceNotFoundMiddleware);
  container.registerSingleton<AbstractErrorMiddleware>(
    "ErrorHandlingMiddleware",
    ErrorHandlingMiddleware
  );
}
