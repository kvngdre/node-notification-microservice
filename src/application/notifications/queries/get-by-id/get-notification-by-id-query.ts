import { IRequest } from "@shared-kernel/mediator/request-interface";

export class GetNotificationByIdQuery implements IRequest {
  constructor(public readonly notificationId: string) {}
}
