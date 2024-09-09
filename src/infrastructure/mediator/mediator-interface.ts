import { ResultType } from "@shared-kernel/result";
import { IRequest } from "./request-interface";
import { IRequestHandler } from "./request-handler-interface";

export interface IMediator {
  send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>>;
  registerHandler(command: string, handler: IRequestHandler<IRequest, unknown>): void;
}
