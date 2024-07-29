import { Exception } from "./exception";

type MessageType<T> = T extends true ? string : never;
type ExceptionType<T> = T extends true ? never : Exception;
type ValueType<T, U> = T extends true ? U : never;

export class Result<TValue> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _message: string | never,
    private readonly _value: (TValue | undefined) | never,
    private readonly _exception: Exception | never
  ) {}

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure() {
    return !this._isSuccess;
  }

  public get message() {
    if (this.isFailure) {
      throw new Error("Cannot get message of a failure result");
    }

    return this._message;
  }

  public get value() {
    if (this.isFailure) {
      throw new Error("Cannot get data of a failure result");
    }

    return this._value;
  }

  public get exception() {
    if (this.isSuccess) {
      throw new Error("Cannot get exception of a success result");
    }

    return this._exception;
  }

  public static success<TValue>(message: string, value: TValue | undefined) {
    return new Result(true, message, value, undefined as never);
  }

  public static failure<TException extends Exception>(exception: TException) {
    return new Result(false, undefined as never, undefined as never, exception);
  }
}

// const res = new Result(true, "", undefined, undefined as never);
// const res = Result.success("", 2);
const res = Result.failure(Exception.Unexpected);

res.exception;
res.isFailure;
res.isSuccess;
res.message;
res.value;

export type ResultType<TValue = unknown> = ISuccessResult<TValue> | IFailureResult;

interface ISuccessResult<TValue> {
  get isSuccess(): true;
  get isFailure(): false;
  get message(): string;
  get value(): TValue;
  get exception(): never;
}

interface IFailureResult<TValue extends never = never> {
  get isSuccess(): false;
  get isFailure(): true;
  get message(): never;
  get value(): TValue;
  get exception(): Exception;
}
