import { singleton } from "tsyringe";
import { Logger } from "@infrastructure/logger";

@singleton()
export class GlobalErrorHandler {
  constructor(private readonly _logger: Logger) {}

  public async handle(error: Error): Promise<void> {
    this._logger.logError(error.message, error.stack);

    // ! Run processes below
    this._contactAdmin();
  }

  private _contactAdmin() {}
}
