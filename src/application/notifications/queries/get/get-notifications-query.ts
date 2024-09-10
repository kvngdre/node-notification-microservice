import { IRequest } from "@infrastructure/mediator/request-interface";

export class GetNotificationsQuery implements IRequest {
  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly channel?: string,
    public readonly status?: string
  ) {}
}
