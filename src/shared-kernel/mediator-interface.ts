import { IRequest, IRequestHandler } from "@infrastructure/mediator";
import { ResultType } from "@shared-kernel/result";

export interface IMediator {
  send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>>;
  registerHandler<T extends IRequest>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: new (...args: any[]) => T,
    handler: IRequestHandler<T, unknown>
  ): void;
}
