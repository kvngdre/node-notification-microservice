import { singleton } from "tsyringe";
import { Logger } from "@infrastructure/logging/logger";

@singleton()
export class GlobalErrorHandler {
  constructor(private readonly _logger: Logger) {}

  public static isRegistered = false;

  public async registerProcessListeners() {
    process.on("unhandledRejection", (reason) => {
      this._logger.logDebug("===unhandledRejection===");
      throw reason;
    });

    process.on("uncaughtException", async (error) => {
      this._logger.logDebug("===uncaughtException===");
      await this.handle(error);
    });

    GlobalErrorHandler.isRegistered = true;

    this._logger.logDebug("Process listeners registered...✅");
  }

  public async handle(error: Error): Promise<void> {
    if (GlobalErrorHandler.isRegistered === false) {
      this.registerProcessListeners();
    }

    this._logger.logError(error.message, error.stack);

    // ! Run processes below
    await this._contactAdmin();
  }

  private async _contactAdmin() {
    this._logger.logInfo("sending email...");
  }
}
