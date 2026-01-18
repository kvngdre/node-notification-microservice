import { type Request, type Response, type NextFunction } from "express";
import { injectable } from "inversify";
import { AbstractMiddleware } from "@web/abstractions/abstract-middleware.js";
import { Exception } from "@shared-kernel/exception.js";
import { ApiResponse } from "@web/utils/api-response.js";

@injectable()
export class ResourceNotFoundMiddleware extends AbstractMiddleware {
  public execute(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    const exception = Exception.NotFound(
      "General.ResourceNotFound",
      `The requested resource at '${req.method} ${req.originalUrl}' not found.`
    );

    res.status(404).json(ApiResponse.failure(exception, res));
  }
}
