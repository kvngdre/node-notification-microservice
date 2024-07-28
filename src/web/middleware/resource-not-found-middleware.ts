import { type Request, type Response, type NextFunction } from "express";
import { singleton } from "tsyringe";
import { AbstractMiddleware } from "@web/abstractions/types";
import { Exception } from "@shared-kernel/exception";

@singleton()
export class ResourceNotFoundMiddleware extends AbstractMiddleware {
  public execute(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    const exception = Exception.NotFound(
      "General.ResourceNotFound",
      `The request resource at '${req.originalUrl}' could not be located.`
    );

    res.status(404).json(exception);
  }
}
