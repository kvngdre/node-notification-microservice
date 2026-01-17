import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { DatabaseContext } from "@infrastructure/database/database-context";
import container, { registerServices } from "./di-container";
import WebApp from "./web/web-app";
// import { DeadLetterQueueConsumer } from "@infrastructure/consumer";

export async function startup(): Promise<WebApp> {
  registerServices();

  // Connect to the database
  await container.get<DatabaseContext>("DatabaseContext").connect();

  // await container.resolve(DeadLetterQueueConsumer).consume();

  const app = new WebApp({
    port: Number(process.env.PORT)
  });

  return app; // Return for testing
}

// Only run in production/development, not during testing
if (process.env.NODE_ENV !== "test") {
  startup()
    .then((app) => app.run())
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}
