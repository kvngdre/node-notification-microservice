import { IRequest } from "@shared-kernel/mediator/request-interface";

export class DeleteNotificationByIdCommand implements IRequest {
  constructor(public readonly notificationId: string) {}
}
