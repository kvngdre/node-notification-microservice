import { type Server } from "http";
import { type IWebAppOptions } from "./abstractions/interfaces";
import express, { json, urlencoded, type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { container } from "tsyringe";
import { Environment } from "src/shared-kernel";
import {
  ErrorHandlingMiddleware,
  RequestLoggingMiddleware,
  ResourceNotFoundMiddleware
} from "./middleware";
import { apiRouter } from "./routers/api-router";
import { AbstractErrorMiddleware, AbstractMiddleware } from "./abstractions/types";
import { ILogger } from "@application/abstractions/logging/logger-interface";

export default class WebApp {
  private readonly _app: Express = express();
  private _server: Server | null = null;
  private _options: IWebAppOptions = { port: 3000 };

  private readonly _requestLoggingMiddleware: AbstractMiddleware;
  private readonly _resourceNotFoundMiddleware: AbstractMiddleware;
  private readonly _errorHandlingMiddleware: AbstractErrorMiddleware;
  private readonly _logger: ILogger;

  constructor(options: IWebAppOptions) {
    try {
      this._requestLoggingMiddleware = container.resolve(RequestLoggingMiddleware);
      this._resourceNotFoundMiddleware = container.resolve(ResourceNotFoundMiddleware);
      this._errorHandlingMiddleware = container.resolve(ErrorHandlingMiddleware);
      this._logger = container.resolve("Logger");
    } catch (error) {
      throw new Error(`DI container resolution failed: ${error}`);
    }

    this.setOptions(options);
  }

  public getOptions(): IWebAppOptions {
    return this._options;
  }

  public setOptions(options: Partial<IWebAppOptions>): void {
    this._parsePortNumberOrThrow(options.port ?? this._options?.port);

    this._options = { ...this._options, ...options };
  }

  public run(): void {
    try {
      const port = this._options.port;
      this._setup();

      this._server = this._app.listen(port, () => {
        this._logger.logInfo(`Server running on port: [${port}]`);

        if (Environment.isDevelopment) {
          this._logger.logInfo(`http://localhost:${port}/api/v1`);
        }
      });

      this._server.on("error", (error) => {
        this._logger.logError("Server error:", error);
        throw error;
      });
    } catch (error) {
      this._logger.logError("Failed to start server:", error);
      throw error;
    }
  }

  private _setup(): void {
    this._app.use(cors());
    this._app.use(helmet());

    this._app.use(json());
    this._app.use(urlencoded({ extended: true }));

    this._app.use(this._requestLoggingMiddleware.execute);

    this._app.use("/api/v1", apiRouter);
    this._app.use("*", this._resourceNotFoundMiddleware.execute);

    this._app.use(this._errorHandlingMiddleware.execute);
  }

  private _parsePortNumberOrThrow(value: number | string) {
    const port = Number(value);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid port: ${value}. Must be 1-65535`);
    }
  }
}
