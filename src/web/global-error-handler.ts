import { singleton } from "tsyringe";
import { Logger } from "@infrastructure/logger";

@singleton()
export class GlobalErrorHandler {
  constructor(private readonly _logger: Logger) {}

  public async registerProcessListeners() {
    process.on("unhandledRejection", (reason) => {
      throw reason;
    });

    process.on("uncaughtException", async (error) => {
      await this.handle(error);
    });

    this._logger.logDebug("Listeners registered.");
  }

  public async handle(error: Error): Promise<void> {
    this._logger.logError(error.message, error.stack);

    // ! Run processes below
    await this._contactAdmin();
  }

  private async _contactAdmin() {
    console.log("was called");
  }
}
