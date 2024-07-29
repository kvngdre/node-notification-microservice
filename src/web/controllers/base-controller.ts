import { Mediator } from "@shared-kernel/mediator";
import { ResultType } from "@shared-kernel/result";
import { ApiResponse } from "@web/infrastructure/api-response";
import { HttpStatus } from "@web/infrastructure/http-status";

export abstract class BaseController {
  protected readonly mediator = new Mediator();

  constructor() {
    this.mediator.registerHandlers();
  }

  protected buildHttpResponse<TValue, TS extends boolean>(result: ResultType<TValue>) {
    const code = result.isSuccess
      ? HttpStatus.OK
      : HttpStatus.mapExceptionToHttpStatus(result.exception);

    const payload = result.isSuccess
      ? ApiResponse.success<TValue>(result.message, result.value)
      : ApiResponse.failure(result.exception);

    return {
      code,
      payload
    };
  }
}
