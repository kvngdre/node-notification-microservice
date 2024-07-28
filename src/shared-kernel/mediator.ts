import { container } from "tsyringe";
import { IRequest, IRequestHandler } from "@application/abstractions/messaging";

type RequestHandlerType<T> = IRequestHandler<IRequest<T>, T>;

export class Mediator {
  public async send<TResult>(request: IRequest<TResult>): Promise<TResult> {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    const requestHandler = container.resolve<RequestHandlerType<TResult>>(`${requestName}Handler`);

    const result = await requestHandler.handle(request);

    return result as TResult;
  }
}
