import { type Response } from "express";
import { container } from "tsyringe";
import { ResultType } from "@shared-kernel/result";
import { ApiResponse } from "@web/utils/api-response";
import { HttpStatus } from "@web/utils/http-status";
import { IMediator } from "@shared-kernel/mediator-interface";

export abstract class BaseController {
  // protected readonly mediator: IMediator = container.resolve("Mediator");

  constructor() {
    // this.mediator.registerHandlers();
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
