import { Exception } from "./exception";

type MessageType<T> = T extends true ? string : never;
type ExceptionType<T> = T extends true ? never : Exception;
type ValueType<T, U> = T extends true ? U : never;

export class Result<TSuccess extends boolean, TValue> {
  constructor(
    private readonly _isSuccess: TSuccess,
    private readonly _message: MessageType<TSuccess>,
    private readonly _value: ValueType<TSuccess, TValue>,
    private readonly _exception: ExceptionType<TSuccess>
  ) {}

  public get isSuccess() {
    return this._isSuccess;
  }

  public get isFailure(): TSuccess extends true ? false : true {
    return !this._isSuccess as TSuccess extends true ? false : true;
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

  public static success<TValue>(message: string, value?: TValue) {
    return new Result(true, message, value, undefined as never);
  }

  public static failure(exception: Exception) {
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

// export type ResultType<TValue = unknown> = ISuccessResult<TValue> | IFailureResult;

// interface ISuccessResult<TValue> {
//   get isSuccess(): true;
//   get isFailure(): false;
//   get message(): string;
//   get value(): TValue | undefined;
//   get exception(): never;
// }

// interface IFailureResult {
//   get isSuccess(): false;
//   get isFailure(): true;
//   get message(): never;
//   get value(): never;
//   get exception(): Exception;
// }
