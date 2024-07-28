import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import "./dependency-injection";
import { container } from "tsyringe";
import Webapp from "./webapp";
import { GlobalErrorHandler } from "./infrastructure/global-error-handler";

async function startup() {
  const g = container.resolve(GlobalErrorHandler);
  g.registerProcessListeners();

  const app = new Webapp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startup();
