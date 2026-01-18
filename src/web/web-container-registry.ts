import { AbstractErrorMiddleware, AbstractMiddleware } from "@web/abstractions/types";
import { ErrorHandlingMiddleware } from "./middleware/error-handling-middleware";
import { RequestLoggingMiddleware } from "./middleware/request-logging.middleware";
import { ResourceNotFoundMiddleware } from "./middleware/resource-not-found-middleware";
import container from "src/di-container";
import GlobalErrorHandler, { IGlobalErrorHandler } from "./utils/global-error-handler";
import NotificationsController from "./controllers/notifications-controller";

export function registerWebServices() {
  container
    .bind<AbstractMiddleware>("RequestLoggingMiddleware")
    .to(RequestLoggingMiddleware)
    .inSingletonScope();
  container
    .bind<AbstractMiddleware>("ResourceNotFoundMiddleware")
    .to(ResourceNotFoundMiddleware)
    .inSingletonScope();
  container
    .bind<AbstractErrorMiddleware>("ErrorHandlingMiddleware")
    .to(ErrorHandlingMiddleware)
    .inSingletonScope();
  container
    .bind<IGlobalErrorHandler>("GlobalErrorHandler")
    .to(GlobalErrorHandler)
    .inSingletonScope();

  container.bind(NotificationsController).toSelf().inSingletonScope();
}
