import { NotificationStatus } from "@domain/notification";

export class CreateNotificationCommand {
  constructor(
    public readonly channel: string,
    public readonly data: string,
    public readonly retryCount?: number,
    public readonly status?: NotificationStatus
  ) {}
}
