import { NotificationChannelType, NotificationData } from "@domain/notification/types/index.js";

export class SendNotificationCommand {
  constructor(
    public readonly channel: NotificationChannelType,
    public readonly data: NotificationData<NotificationChannelType>
  ) {}
}
