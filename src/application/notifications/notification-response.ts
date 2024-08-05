import { Notification } from "@domain/notifications";

export class NotificationResponse {
  private constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly channel: string,
    public readonly retryCount: number,
    public readonly data: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(notification: Notification) {
    return new NotificationResponse(
      notification.id,
      notification.status,
      notification.channel,
      notification.retryCount,
      notification.data,
      notification.createdAt,
      notification.updatedAt
    );
  }

  public static fromMany(notifications: Notification[]) {
    return notifications.map(
      (n) =>
        new NotificationResponse(
          n.id,
          n.status,
          n.channel,
          n.retryCount,
          n.data,
          n.createdAt,
          n.updatedAt
        )
    );
  }
}
