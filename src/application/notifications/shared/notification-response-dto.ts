import { Notification } from "@domain/notification";

export class NotificationResponseDTO {
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
    return new NotificationResponseDTO(
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
        new NotificationResponseDTO(
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
