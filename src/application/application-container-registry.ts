import container from "../di-container.js";
import {
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notifications/commands/create/index.js";
import { GetNotificationQueryHandler } from "./notifications/queries/get-one/index.js";
import { GetNotificationsQueryHandler } from "./notifications/queries/get-many/index.js";
import {
  DeleteNotificationCommandHandler,
  DeleteNotificationCommandValidator
} from "./notifications/commands/delete/index.js";
import {
  SendNotificationCommandHandler,
  SendNotificationCommandValidator
} from "./notifications/commands/send/index.js";

export function registerApplicationServices() {
  container.bind(CreateNotificationCommandHandler).toSelf().inSingletonScope();
  container.bind(GetNotificationQueryHandler).toSelf().inSingletonScope();
  container.bind(GetNotificationsQueryHandler).toSelf().inSingletonScope();
  container.bind(DeleteNotificationCommandHandler).toSelf().inSingletonScope();
  container.bind(SendNotificationCommandHandler).toSelf().inSingletonScope();

  container.bind(CreateNotificationCommandValidator).toSelf().inSingletonScope();
  container.bind(SendNotificationCommandValidator).toSelf().inSingletonScope();
  container.bind(DeleteNotificationCommandValidator).toSelf().inSingletonScope();
}
