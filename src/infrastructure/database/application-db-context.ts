import { DataSource } from "typeorm";
import { singleton } from "tsyringe";
import { Notification } from "@domain/notification/notification";
import { Environment } from "@shared-kernel/environment";
import { Logger } from "@infrastructure/logging/logger";

@singleton()
export class ApplicationDbContext {
  private readonly _dataSource: DataSource;
  private _connection: DataSource;

  constructor(private readonly _logger: Logger) {
    const connectionURI = process.env.DB_URI;

    if (!connectionURI) {
      throw new Error("No database connection URI provided");
    }

    this._dataSource = new DataSource({
      type: "postgres",
      url: connectionURI,
      entities: [Notification],
      connectTimeoutMS: Environment.isDevelopment ? 10_000 : 60_000,
      logging: Environment.isDevelopment || Environment.isTest
      //   synchronize: Environment.isDevelopment || Environment.isTest
    });
  }

  public async connect(): Promise<void> {
    const stdout = process.stdout;

    try {
      stdout.write("Attempting connection to the database....\n");
      this._connection = await this._dataSource.initialize();

      stdout.clearLine(0);
      stdout.clearLine(0);
      stdout.cursorTo(0);

      if (this._connection.isInitialized) {
        this._logger.logInfo("Connected to database");
      }
    } catch (error: unknown) {
      stdout.clearLine(0);
      stdout.clearLine(0);
      stdout.cursorTo(0);

      if (error instanceof Error) {
        throw new Error(`Failed to connect to the database. Reason-> ${error.message}`);
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this._connection.destroy();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to disconnect from database. Reason-> ${error.message}`);
      }
    }
  }

  public get notifications() {
    return this._connection.getRepository(Notification);
  }
}
