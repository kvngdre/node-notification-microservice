import { inject, injectable } from "inversify";
import { ILogger } from "@shared-kernel/logger-interface.js";

export interface IGlobalErrorHandler {
  handle(error: Error): Promise<void>;
}
@injectable()
export default class GlobalErrorHandler implements IGlobalErrorHandler {
  constructor(@inject("Logger") private readonly _logger: ILogger) {}

  public async handle(error: Error): Promise<void> {
    this._logger.logError(`Global error: ${error.message}`, error.stack);

    // Run other processes below
    await this._contactAdmin();
  }

  private async _contactAdmin() {
    this._logger.logInfo("sending email...");
  }
}
