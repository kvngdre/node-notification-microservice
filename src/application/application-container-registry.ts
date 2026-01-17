import container from "../di-container";
import {
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notifications/commands/create";
import { GetNotificationByIdQueryHandler } from "./notifications/queries/get-by-id";
import { GetNotificationsQueryHandler } from "./notifications/queries/get";
import {
  DeleteNotificationByIdCommandHandler,
  DeleteNotificationByIdCommandValidator
} from "./notifications/commands/delete-by-id";
import {
  SendNotificationCommandHandler,
  SendNotificationCommandValidator
} from "./notifications/commands/send";

export function registerApplicationServices() {
  container.bind("CreateNotificationCommandHandler").to(CreateNotificationCommandHandler);
  container.bind("GetNotificationByIdQueryHandler").to(GetNotificationByIdQueryHandler);
  container.bind("GetNotificationsQueryHandler").to(GetNotificationsQueryHandler);
  container.bind("DeleteNotificationByIdCommandHandler").to(DeleteNotificationByIdCommandHandler);
  container.bind("SendNotificationCommandHandler").to(SendNotificationCommandHandler);

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
