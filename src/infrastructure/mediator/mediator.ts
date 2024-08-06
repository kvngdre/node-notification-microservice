import { container, singleton } from "tsyringe";
import * as glob from "glob";
import * as fs from "fs";
import { IRequest, IRequestHandler } from "@application/abstractions/messaging";
import { ResultType, IMediator } from "@shared-kernel/index";

type RequestHandlerType<T> = IRequestHandler<IRequest<T>, T>;

@singleton()
export class Mediator implements IMediator {
  private _handlers: Map<string, IRequestHandler<IRequest, unknown>> = new Map();

  constructor() {
    this.registerHandler.bind(this);
  }

  public get handlers() {
    return this._handlers;
  }

  public async send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>> {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    const handler = this._handlers.get(requestName) as RequestHandlerType<TValue>;

    if (!handler) {
      throw new Error(`No request handler found for request: ${requestName}`);
    }

    // const requestHandler = container.resolve<RequestHandlerType<TValue>>(`${requestName}Handler`);

    const result = await handler.handle(request);

    return result;
  }

  public registerHandler(command: string, handler: IRequestHandler<IRequest, unknown>): void {
    this._handlers = this._handlers.set(command, handler);
  }

  public registerHandlers() {
    const pattern = "**/*-handler.ts";

    const handlerFiles = glob.sync(pattern, {
      ignore: ["node_modules/**"]
    });

    console.log(handlerFiles);
  }
}
