import { IRequest } from "@application/abstractions/messaging";
import { Result } from "@shared-kernel/result";

export interface IMediator {
  send<TValue>(request: IRequest<TValue>): Promise<Result<TValue>>;
}
