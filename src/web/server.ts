import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import "./dependency-injection";
import { container } from "tsyringe";
import Webapp from "./webapp";
import { GlobalErrorHandler } from "./global-error-handler";

async function startUp() {
  const e = container.resolve(GlobalErrorHandler);

  e.registerProcessListeners();

  const app = new Webapp({
    port: Number(process.env.PORT)
  });
  app.run();

  return app;
}

export default startUp();
