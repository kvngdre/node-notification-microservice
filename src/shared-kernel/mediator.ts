import { container, singleton } from "tsyringe";
import { IRequest, IRequestHandler } from "@application/abstractions/messaging";
import { IMediator } from "./interfaces";
import { ResultType } from "./result";

type RequestHandlerType<T> = IRequestHandler<IRequest<T>, T>;

@singleton()
export class Mediator implements IMediator {
  private readonly _handlers: Map<string, IRequestHandler<IRequest, unknown>> = new Map();

  public async send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>> {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    // const handler = this._handlers[requestName];
    const handler = this._handlers.get(requestName) as RequestHandlerType<TValue>;

    if (!handler) {
      throw new Error(`No request handler found for request: ${requestName}`);
    }

    // const requestHandler = container.resolve<RequestHandlerType<TValue>>(`${requestName}Handler`);

    const result = await handler.handle(request);

    return result;
  }

  public registerHandler(command: string, handler: IRequestHandler<IRequest, unknown>): void {
    this._handlers.set(command, handler);
  }

  public registerHandlers() {
    const requests = container.resolveAll("CommandHandler");

    console.log({ requests });
  }
}
