import { IRequest } from "@infrastructure/mediator/request-interface";

export class DeleteNotificationByIdCommand implements IRequest {
  constructor(public readonly notificationId: string) {}
}
