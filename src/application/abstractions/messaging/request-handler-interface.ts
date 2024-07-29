import { container } from "tsyringe";
import { ResultType } from "@shared-kernel/result";
import { IRequest } from "./request-interface";
import { IMediator } from "@shared-kernel/interfaces";
import { Mediator } from "@shared-kernel/mediator";

export abstract class IRequestHandler<TRequest extends IRequest, TResult> {
  protected mediator: IMediator = container.resolve(Mediator);

  abstract handle(request: TRequest): Promise<ResultType<TResult>>;
}
