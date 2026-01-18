import container from "../di-container";
import {
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notifications/commands/create";
import { GetNotificationByIdQueryHandler } from "./notifications/queries/get-by-id";
import { GetNotificationsQueryHandler } from "./notifications/queries/get-many";
import {
  DeleteNotificationByIdCommandHandler,
  DeleteNotificationByIdCommandValidator
} from "./notifications/commands/delete";
import {
  SendNotificationCommandHandler,
  SendNotificationCommandValidator
} from "./notifications/commands/send";

export function registerApplicationServices() {
  container
    .bind("CreateNotificationCommandHandler")
    .to(CreateNotificationCommandHandler)
    .inSingletonScope();
  container
    .bind("GetNotificationByIdQueryHandler")
    .to(GetNotificationByIdQueryHandler)
    .inSingletonScope();
  container
    .bind("GetNotificationsQueryHandler")
    .to(GetNotificationsQueryHandler)
    .inSingletonScope();
  container
    .bind("DeleteNotificationByIdCommandHandler")
    .to(DeleteNotificationByIdCommandHandler)
    .inSingletonScope();
  container
    .bind("SendNotificationCommandHandler")
    .to(SendNotificationCommandHandler)
    .inSingletonScope();

  container
    .bind("CreateNotificationCommandValidator")
    .to(CreateNotificationCommandValidator)
    .inSingletonScope();
  container
    .bind("SendNotificationCommandValidator")
    .to(SendNotificationCommandValidator)
    .inSingletonScope();
  container
    .bind("DeleteNotificationByIdCommandValidator")
    .to(DeleteNotificationByIdCommandValidator)
    .inSingletonScope();
}
