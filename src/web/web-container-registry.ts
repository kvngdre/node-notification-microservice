import container from "../di-container.js";
import { AbstractErrorMiddleware, AbstractMiddleware } from "@web/abstractions/index.js";
import {
  ErrorHandlingMiddleware,
  RequestLoggingMiddleware,
  ResourceNotFoundMiddleware
} from "./middleware/index.js";
import GlobalErrorHandler, { IGlobalErrorHandler } from "./utils/global-error-handler.js";
import NotificationsController from "./controllers/notifications-controller.js";

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
