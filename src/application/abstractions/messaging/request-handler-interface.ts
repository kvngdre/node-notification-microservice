import { ResultType } from "@shared-kernel/result";
import { IRequest } from "./request-interface";

export abstract class IRequestHandler<TRequest extends IRequest, TResult> {
  constructor() {
    this.handle.bind(this);
  }

  abstract handle(request: TRequest): Promise<ResultType<TResult>>;
}
