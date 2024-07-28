import { IRequest } from "./request-interface";

export interface IRequestHandler<TRequest extends IRequest<TResult>, TResult> {
  handle(request: TRequest): Promise<TResult>;
}
