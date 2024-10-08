import { Exception } from "@shared-kernel/exception";

export class NotificationExceptions {
  public static readonly NotFound = (id: string) =>
    Exception.NotFound(
      "Notification.NotFound",
      `Notification with the given identifier '${id}' was not found.`
    );

  public static readonly NoMatchFound = Exception.NotFound(
    "Notification.NoMatchFound",
    "No notifications found"
  );
}
