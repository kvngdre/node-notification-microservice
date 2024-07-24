import express, { json, urlencoded, type Express } from "express";
import { container } from "tsyringe";
import { Environment, Logger } from "@infrastructure/utils";
import { IWebAppOptions } from "./shared/interfaces";
// import apiRouter from "./routers";
// import {
//   ExceptionHandlingMiddleware,
//   RequestLoggingMiddleware,
//   ResourceNotFoundMiddleware
// } from "./middleware";

export default class WebApp {
  private readonly _app: Express = express();
  // private readonly _requestLoggingMiddleware = container.resolve(RequestLoggingMiddleware);
  // private readonly _resourceNotFoundMiddleware = container.resolve(ResourceNotFoundMiddleware);
  // private readonly _exceptionHandlingMiddleware = container.resolve(ExceptionHandlingMiddleware);
  private readonly _logger: Logger = container.resolve(Logger);
  private readonly _options: IWebAppOptions = {};

  constructor(options?: IWebAppOptions) {
    this._options = options ?? { port: Number(process.env.API_PORT) };
    this._setup();
  }

  public getOptions(): IWebAppOptions {
    return this._options;
  }

  /**
   * Configure the options for the web application instance.
   * @param key The option to be set.
   * @param value The value of the option.
   */
  public setOption<K extends keyof IWebAppOptions>(key: K, value: IWebAppOptions[K]): void {
    this._options[key] = value;
  }

  public run(): void {
    const { port } = this._options;

    this._app.listen(port, () => {
      this._logger.logInfo(`Server running on port: ${port}.`);
      if (Environment.isDevelopment) {
        this._logger.logInfo(`http://localhost:${port}`);
      }
    });
  }

  private _setup(): void {
    this._app.use(json());
    this._app.use(urlencoded({ extended: true }));
    // this._app.use(this._requestLoggingMiddleware!.execute);

    // Register application router
    // this._app.use("/api/v1", apiRouter);

    // this._app.use(this._resourceNotFoundMiddleware!.execute);
    // this._app.use(this._exceptionHandlingMiddleware.execute);
  }
}
