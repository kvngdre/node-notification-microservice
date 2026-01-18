/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from "inversify";
import { sync } from "glob";
import path from "path";
import container from "src/di-container";
import { ResultType, ILogger } from "@shared-kernel/index";
import { IRequestHandler } from "./request-handler-interface";
import { IRequest } from "./request-interface";
import { IMediator } from "./mediator-interface";

@injectable()
export default class Mediator implements IMediator {
  private _handlers: Map<string, IRequestHandler<IRequest, unknown>> = new Map();

  constructor(@inject("Logger") private readonly _logger: ILogger) {
    this.registerHandler.bind(this);
    this._discoverAndRegisterHandlers();
  }

  public async send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>> {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    const handler = this._handlers.get(requestName) as IRequestHandler<IRequest<TValue>, TValue>;

    if (!handler) {
      throw new Error(`No request handler found for request: ${requestName}`);
    }

    const result = await handler.handle(request);

    return result;
  }

  public registerHandler<T extends IRequest>(
    requestClass: new (...args: any[]) => T,
    handler: IRequestHandler<T, unknown>
  ): void {
    this._handlers.set(requestClass.name, handler);
  }

  private async _discoverAndRegisterHandlers() {
    this._logger.logDebug("Starting handler discovery...");

    const pattern = "**/*-handler.{ts,js}";
    const handlerFiles = sync(pattern, {
      ignore: ["node_modules/**", "**/*-error-handler.{ts,js}"]
    });

    this._logger.logDebug(
      `Found ${handlerFiles.length} handler files matching pattern: ${pattern}`
    );

    let registeredCount = 0;

    for (const file of handlerFiles) {
      this._logger.logDebug(`Processing handler file: ${file}`);

      try {
        // Dynamically import the handler file
        const filePath = path.resolve(file);

        const handlerModule = await import(filePath);
        const exportKeys = Object.keys(handlerModule);

        this._logger.logDebug(
          `Found ${exportKeys.length} exports in ${file}: [${exportKeys.join(", ")}]`
        );

        // Iterate over the module's exports to find the handler class
        for (const key of exportKeys) {
          const handlerClass = handlerModule[key];

          // Check if the handler class implements the IRequestHandler interface
          if (this._isRequestHandler(handlerClass)) {
            try {
              // Resolve the handler instance using DI container
              this._logger.logDebug(`Resolving handler for class: ${handlerClass.name}`);
              const handlerInstance = container.get<IRequestHandler<IRequest, unknown>>(
                handlerClass.name
              );
              this._logger.logDebug(
                `Resolved handler instance for ${handlerInstance.constructor.name}`
              );

              // Extract the request type from the handler (optional: based on naming convention or custom logic)
              const requestName = this._getRequestName(handlerClass);
              this._logger.logDebug(
                `Associating handler ${handlerClass.name} with request: ${requestName}`
              );

              // Register the handler in the _handlers map
              this._handlers.set(requestName, handlerInstance);

              registeredCount++;
              this._logger.logDebug(
                `✅ Registered handler: ${handlerClass.name} for request: ${requestName}`
              );
            } catch (error) {
              this._logger.logError((error as Error).message);
              this._logger.logError(`❌ Failed to resolve handler ${handlerClass.name}:`, {
                error
              });
            }
          } else {
            this._logger.logDebug(`⏭️ Skipping ${key}: not a request handler`);
          }
        }
      } catch (error) {
        this._logger.logError(`❌ Failed to process handler file ${file}:`, error);
      }
    }

    this._logger.logInfo(
      `Request handlers registration complete. Registered ${registeredCount} handlers ✅`
    );
  }

  // Helper method to check if a class implements IRequestHandler
  private _isRequestHandler(handlerClass: any): boolean {
    return (
      typeof handlerClass === "function" &&
      handlerClass.prototype &&
      typeof handlerClass.prototype.handle === "function"
    );
  }

  // Helper method to extract the request type or name
  private _getRequestName(handlerClass: any): string {
    // Assuming the handler class follows a naming convention like SomeRequestHandler
    return handlerClass.name.replace("Handler", "");
  }
}
