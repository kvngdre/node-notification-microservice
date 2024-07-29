import { Mediator } from "@shared-kernel/mediator";
import { Result, ResultType } from "@shared-kernel/result";
import { ApiResponse, ApiResponseType } from "@web/infrastructure/api-response";
import { HttpStatus } from "@web/infrastructure/http-status";

export abstract class BaseController {
  protected readonly mediator = new Mediator();

  protected buildHttpResponse<TValue>(result: Result<TValue>) {
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
