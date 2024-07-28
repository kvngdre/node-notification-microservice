import { IRequest } from "@application/abstractions/messaging";

export interface IMediator {
  send<TResult>(request: IRequest<TResult>): Promise<TResult>;
}
