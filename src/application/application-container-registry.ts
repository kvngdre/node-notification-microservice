import container from "../di-container";
import {
  CreateNotificationCommandHandler,
  CreateNotificationCommandValidator
} from "./notifications/commands/create";
import { GetNotificationQueryHandler } from "./notifications/queries/get-one";
import { GetNotificationsQueryHandler } from "./notifications/queries/get-many";
import {
  DeleteNotificationCommandHandler,
  DeleteNotificationCommandValidator
} from "./notifications/commands/delete";
import {
  SendNotificationCommandHandler,
  SendNotificationCommandValidator
} from "./notifications/commands/send";

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
