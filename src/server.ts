import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import DatabaseContext from "@infrastructure/database/database-context.js";
import container, { registerServices } from "./di-container.js";
import WebApp from "./web/web-app.js";
// import { DeadLetterQueueConsumer } from "@infrastructure/consumer";

export async function startup(): Promise<WebApp> {
  registerServices();

  // Connect to the database
  await container.get(DatabaseContext).connect();

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
