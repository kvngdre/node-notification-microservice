import { IRequest } from "@application/abstractions/messaging";

export class GetNotificationByIdQuery implements IRequest {
  constructor(public readonly notificationId: string) {}
}
