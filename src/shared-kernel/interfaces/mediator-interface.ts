import { IRequest, IRequestHandler } from "@application/abstractions/messaging";
import { ResultType } from "@shared-kernel/result";

export interface IMediator {
  send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>>;
  registerHandler(command: string, handler: IRequestHandler<IRequest, unknown>): void;
}
