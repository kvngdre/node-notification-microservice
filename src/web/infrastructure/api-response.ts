import { Exception } from "@shared-kernel/exception";

type MessageType<T extends boolean> = T extends true ? string : never;
type DataType<T extends boolean, TData> = T extends true ? TData : never;
type ErrorType<T extends boolean> = T extends true ? never : Exception;

/**
 * Represents the response payload for HTTP requests.
 */
export class ApiResponse<TSuccess extends boolean, TData> {
  private constructor(
    public readonly success: TSuccess,
    public readonly message: MessageType<TSuccess>,
    public readonly data: DataType<TSuccess, TData>,
    public readonly error: ErrorType<TSuccess>
  ) {}

  /**
   * Creates a successful response payload.
   * @param message - The message to include in the payload.
   * @param data - The data to include in the payload.
   * @returns An instance of ApiResponse with success status.
   */
  public static success<T>(message: string, data?: T) {
    return new ApiResponse(true, message, data, undefined as never);
  }

  /**
   * Creates a failure response payload.
   * @param exception - The exception to include in the payload.
   * @returns An instance of ApiResponse with failure status.
   */
  public static failure(exception: Exception) {
    return new ApiResponse(false, undefined as never, undefined as never, exception);
  }
}
