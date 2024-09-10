import { IRequest } from "@infrastructure/mediator/request-interface";

export class GetNotificationByIdQuery implements IRequest {
  constructor(public readonly notificationId: string) {}
}
