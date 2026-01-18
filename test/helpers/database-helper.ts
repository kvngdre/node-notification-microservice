import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { DataSource } from "typeorm";
import { Notification } from "@domain/notification/notification-entity";

export class DatabaseTestHelper {
  private static container: StartedTestContainer;
  private static dataSource: DataSource;

  /**
   * Start a PostgreSQL test container for integration tests
   */
  static async setupTestDatabase(): Promise<string> {
    console.log("Starting PostgreSQL container...");
    this.container = await new GenericContainer("postgres:16-alpine")
      .withEnvironment({
        POSTGRES_DB: "test_db",
        POSTGRES_USER: "test_user",
        POSTGRES_PASSWORD: "test_password"
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage("database system is ready to accept connections", 2))
      .start();

    console.log("PostgreSQL container started");
    const host = this.container.getHost();
    const port = this.container.getMappedPort(5432);
    const connectionUri = `postgresql://test_user:test_password@${host}:${port}/test_db`;

    console.log("Connecting to database...");
    // Create TypeORM connection
    this.dataSource = new DataSource({
      type: "postgres",
      url: connectionUri,
      entities: [Notification],
      synchronize: true, // Auto-create tables for tests
      logging: false,
      dropSchema: true // Clean slate for each test run
    });

    await this.dataSource.initialize();
    console.log("Database connection established");

    return connectionUri;
  }

  /**
   * Get the test database connection
   */
  static getConnection(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error("Test database not initialized. Call setupTestDatabase() first.");
    }
    return this.dataSource;
  }

  /**
   * Clean up test database
   */
  static async teardownTestDatabase(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }

    if (this.container) {
      await this.container.stop();
    }
  }

  /**
   * Clear all data between tests
   */
  static async clearDatabase(): Promise<void> {
    const connection = this.getConnection();
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    }
  }

  /**
   * Get repository for testing
   */
  static getRepository<T>(entity: new () => T) {
    return this.getConnection().getRepository(entity);
  }
}
