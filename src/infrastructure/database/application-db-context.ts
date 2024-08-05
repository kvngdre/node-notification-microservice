import { DataSource } from "typeorm";
import { singleton } from "tsyringe";
import { Notification } from "@domain/notifications/notification-entity";
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
      connectTimeoutMS: Environment.isDevelopment ? 10_000 : 60_000,
      entities: ["**src/**/*-entity.{ts,js}"],
      migrations: ["**/migrations/*.{ts,js}"],
      synchronize: true
    });
  }

  public async connect(): Promise<void> {
    try {
      this._connection = await this._dataSource.initialize();

      if (this._connection.isInitialized) {
        this._logger.logInfo("Connected to database");
      }
    } catch (error: unknown) {
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
