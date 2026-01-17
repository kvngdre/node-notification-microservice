import { type Response } from "express";
import container from "src/di-container";
import { ResultType } from "@shared-kernel/result";
import { ApiResponse } from "@web/utils/api-response";
import { HttpStatus } from "@web/utils/http-status";
import { IMediator } from "@shared-kernel/mediator/mediator-interface";

export abstract class BaseController {
  private _mediator: IMediator | undefined;

  // Lazy getter - resolves only when first accessed
  protected get mediator(): IMediator {
    if (!this._mediator) {
      this._mediator = container.get<IMediator>("Mediator");
    }
    return this._mediator;
  }

  protected buildHttpResponse<TValue>(result: ResultType<TValue>, res: Response) {
    const code = result.isSuccess
      ? HttpStatus.OK
      : HttpStatus.mapExceptionToHttpStatus(result.exception);

    const payload = result.isSuccess
      ? ApiResponse.success<TValue>(result.message, result.value)
      : ApiResponse.failure(result.exception, res);

    return {
      code,
      payload
    };
  }
}
