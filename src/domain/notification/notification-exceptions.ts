import { Exception } from "@shared-kernel/exception";

export class NotificationExceptions {
  public static readonly NotFound = Exception.NotFound(
    "Notification.NotFound",
    "Notification not found."
  );

  public static readonly NoMatchFound = Exception.NotFound(
    "Notification.NoMatchFound",
    "No notifications found"
  );
}
