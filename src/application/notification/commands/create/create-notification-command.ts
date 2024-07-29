import { IRequest } from "@application/abstractions/messaging";
import { NotificationResponse } from "@application/notification/notification-response";

export class CreateNotificationCommand {
  constructor(
    public readonly channel: string,
    public readonly data: string
  ) {}
}
