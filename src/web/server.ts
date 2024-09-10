import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { container } from "tsyringe";
import { registerServices } from "./dependency-injection";
import Webapp from "./webapp";
import { GlobalErrorHandler } from "./infrastructure/global-error-handler";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";
import { DeadLetterQueueConsumer } from "@infrastructure/consumer";

async function startup() {
  registerServices();

  await container.resolve(GlobalErrorHandler).registerProcessListeners();

  await container.resolve(ApplicationDbContext).connect();

  await container.resolve(DeadLetterQueueConsumer).consume();

  const app = new Webapp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startup();
