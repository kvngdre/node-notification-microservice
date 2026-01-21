import { type Response } from "express";
import { type ResultType } from "@shared-kernel/result.js";
import { ApiResponse } from "@web/utils/api-response.js";
import { HttpStatus } from "@web/utils/http-status.js";

export abstract class BaseController {
  protected buildHttpResponse<TValue>(result: ResultType<TValue>, res: Response) {
    if (result.isSuccess) {
      const code = HttpStatus.OK;
      const payload = ApiResponse.success<TValue>(result.message, result.value);

      return {
        code,
        payload
      } as const;
    }

    const code = HttpStatus.mapExceptionToHttpStatus(result.exception);
    const payload = ApiResponse.failure(result.exception, res);

    return {
      code,
      payload
    } as const;
  }
}
