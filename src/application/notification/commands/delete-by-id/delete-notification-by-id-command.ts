import { IRequest } from "@application/abstractions/messaging";

export class DeleteNotificationByIdCommand implements IRequest {
  constructor(public readonly notificationId: string) {}
}
