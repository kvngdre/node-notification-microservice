import { singleton } from "tsyringe";
import { Logger } from "src/shared-kernel/logger";

@singleton()
export class GlobalExceptionHandler {
  constructor(private readonly _logger: Logger) {}

  public async handle(exception: Error): Promise<void> {
    this._logger.logError(exception.message, exception.stack);

    // ! Run processes below
    this._contactAdmin();
  }

  private _contactAdmin() {}
}
