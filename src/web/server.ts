import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { container } from "tsyringe";
import { registerServices } from "./dependency-injection";
import Webapp from "./webapp";
import { GlobalErrorHandler } from "./infrastructure/global-error-handler";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";

async function startup() {
  registerServices();

  const g = container.resolve(GlobalErrorHandler);
  g.registerProcessListeners();

  await container.resolve(ApplicationDbContext).connect();

  const app = new Webapp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startup();
