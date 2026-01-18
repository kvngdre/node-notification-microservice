import { ResultType } from "@shared-kernel/index";

export interface IRequestHandler<TRequest, TResponse = unknown> {
  handle(request: TRequest): Promise<ResultType<TResponse>>;
}
