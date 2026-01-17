import { IRequest } from "@shared-kernel/mediator/request-interface";

export class GetNotificationsQuery implements IRequest {
  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly channel?: string,
    public readonly status?: string
  ) {}
}
