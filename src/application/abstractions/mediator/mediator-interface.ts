import { IRequest, IRequestHandler } from "@application/abstractions/mediator";
import { ResultType } from "@shared-kernel/result";

export interface IMediator {
  send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>>;
  registerHandler(command: string, handler: IRequestHandler<IRequest, unknown>): void;
}
