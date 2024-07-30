import { container } from "tsyringe";
import { ResultType } from "@shared-kernel/result";
import { IRequest } from "./request-interface";
import { IMediator } from "./mediator-interface";
import { Mediator } from "@infrastructure/mediator/mediator";

export abstract class IRequestHandler<TRequest extends IRequest, TResult> {
  protected mediator: IMediator = container.resolve(Mediator);

  constructor() {
    this.handle.bind(this);
  }

  abstract handle(request: TRequest): Promise<ResultType<TResult>>;
}
