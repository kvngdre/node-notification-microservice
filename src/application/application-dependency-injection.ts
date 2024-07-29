import { container, Lifecycle } from "tsyringe";
import { CreateNotificationCommandHandler } from "./notification/commands/create/create-notification-command-handler";
import { IRequestHandler } from "./abstractions/messaging";
import { NotificationResponse } from "./notification/notification-response";
import { CreateNotificationCommand } from "./notification/commands/create";

export function registerApplicationServices() {
  container.register<IRequestHandler<CreateNotificationCommand, NotificationResponse>>(
    "CommandHandler",
    CreateNotificationCommandHandler,
    {
      lifecycle: Lifecycle.ResolutionScoped
    }
  );
}
