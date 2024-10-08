import { type Response } from "express";
import { container } from "tsyringe";
import { Mediator } from "@infrastructure/mediator/mediator";
import { ResultType } from "@shared-kernel/result";
import { ApiResponse } from "@web/infrastructure/api-response";
import { HttpStatus } from "@web/infrastructure/http-status";

export abstract class BaseController {
  protected readonly mediator = container.resolve(Mediator);

  constructor() {
    // this.mediator.registerHandlers();
  }

  protected buildHttpResponse<TValue, TS extends boolean>(
    result: ResultType<TValue>,
    res: Response
  ) {
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
