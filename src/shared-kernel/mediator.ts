import { container } from "tsyringe";
import { IRequest, IRequestHandler } from "@application/abstractions/messaging";
import { IMediator } from "./interfaces";
import { Result } from "./result";

type RequestHandlerType<T> = IRequestHandler<IRequest<T>, T>;

export class Mediator implements IMediator {
  public async send<TValue>(request: IRequest<TValue>): Promise<Result<TValue>> {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    const requestHandler = container.resolve<RequestHandlerType<TValue>>(`${requestName}Handler`);

    const result = await requestHandler.handle(request);

    return result as Result<TValue>;
  }
}
