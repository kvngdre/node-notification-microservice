import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { container } from "tsyringe";
import registerServices from "./container-registry";
import WebApp from "./web/web-app";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";
// import { DeadLetterQueueConsumer } from "@infrastructure/consumer";

async function startup() {
  registerServices();

  // Connect to the database
  await container.resolve(ApplicationDbContext).connect();

  // await container.resolve(DeadLetterQueueConsumer).consume();

  const app = new WebApp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startup();
