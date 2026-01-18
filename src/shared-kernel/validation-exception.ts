import { Exception } from "./exception.js";
import { ExceptionType } from "./exception-type.js";

export class ValidationException extends Exception {
  constructor(
    code: string,
    message: string,
    public readonly path: (string | number)[]
  ) {
    super(ExceptionType.Validation, code, message);
  }
}
