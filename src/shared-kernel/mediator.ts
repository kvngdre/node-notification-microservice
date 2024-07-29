import { container, singleton } from "tsyringe";
import { IRequest, IRequestHandler } from "@application/abstractions/messaging";
import { IMediator } from "./interfaces";

type RequestHandlerType<T> = IRequestHandler<IRequest<T>, T>;

@singleton()
export class Mediator implements IMediator {
  public async send<TValue>(request: IRequest<TValue>) {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    const requestHandler = container.resolve<RequestHandlerType<TValue>>(`${requestName}Handler`);

    const result = await requestHandler.handle(request);

    return result;
  }
}
