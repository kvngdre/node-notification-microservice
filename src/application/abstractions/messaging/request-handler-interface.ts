import { ResultType } from "@shared-kernel/index";
import { IRequest } from "./request-interface";

export interface IRequestHandler<TRequest extends IRequest, TResult> {
  handle(request: TRequest): Promise<ResultType<TResult>>;
}
