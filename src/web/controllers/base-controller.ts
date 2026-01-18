import { type Response } from "express";
import { type ResultType } from "@shared-kernel/result";
import { ApiResponse } from "@web/utils/api-response";
import { HttpStatus } from "@web/utils/http-status";

export abstract class BaseController {
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
