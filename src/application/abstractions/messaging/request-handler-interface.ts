import { ResultType } from "@shared-kernel/index.js";

export interface IRequestHandler<TRequest, TResponse = unknown> {
  handle(request: TRequest): Promise<ResultType<TResponse>>;
}
