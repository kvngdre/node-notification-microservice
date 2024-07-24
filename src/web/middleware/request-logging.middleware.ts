import { type NextFunction, type Request, type Response } from "express";
import morgan, { token } from "morgan";
import { inject, injectable } from "tsyringe";
import { AbstractMiddleware } from "@web/shared/types/abstract-middleware.shared";
import { ILogger } from "@application/shared/interfaces/utils/logger-interface";
import { Environment } from "src/shared-kernel";

@injectable()
export class RequestLoggingMiddleware extends AbstractMiddleware {
  constructor(@inject("Logger") private readonly _logger: ILogger) {
    super();
  }

  public execute(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    this._createCustomTokens(req, res);
    const format = Environment.isDevelopment
      ? "dev"
      : ':date[iso] :remote-addr - :remote-user ":method :url :status :res[content-length] :response-time ms" :reqContext';

    const handler = morgan(format, {
      stream: {
        write: (msg: string) => this._logger.logHttp(msg)
      },
      immediate: false
    });

    handler(req, res, (err?: Error) => {
      if (err) {
        next(err);
      }
    });

    return next();
  }

  /**
   * Creates custom tokens to be used by morgan while logging request
   * @param req Request object
   * @param res Response object
   */
  private _createCustomTokens(req: Request, res: Response) {
    token("reqContext", function getRequestBody(req: Request) {
      if (["GET", "DELETE"].includes(req.method)) {
        return JSON.stringify(
          { params: req.params, query: req.query, headers: req.headers },
          null,
          2
        );
      }

      return JSON.stringify(
        { body: req.body, params: req.params, query: req.query, headers: req.headers },
        null,
        2
      );
    });

    token("reqIP", function getRequestIP(req: Request) {
      return req.ip;
    });
  }
}
