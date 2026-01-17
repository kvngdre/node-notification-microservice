import { singleton } from "tsyringe";
import { Logger } from "@infrastructure/logging/logger";

export interface IGlobalErrorHandler {
  handle(error: Error): Promise<void>;
}
@singleton()
export default class GlobalErrorHandler implements IGlobalErrorHandler {
  constructor(private readonly _logger: Logger) {}

  public async handle(error: Error): Promise<void> {
    this._logger.logError(error.message, error.stack);

    // Run other processes below
    await this._contactAdmin();
  }

  private async _contactAdmin() {
    this._logger.logInfo("sending email...");
  }
}
