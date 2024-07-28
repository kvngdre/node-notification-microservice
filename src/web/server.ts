import "reflect-metadata";
import "express-async-errors";
import { config } from "dotenv";
// import "./dependency-injection";
import { container } from "tsyringe";
import { registerServices } from "./dependency-injection";
import Webapp from "./webapp";
import { GlobalErrorHandler } from "./global-error-handler";

async function startUp() {
  const { error } = config();
  if (error) {
    throw new Error(error.message);
  }

  registerServices();

  const e = container.resolve(GlobalErrorHandler);
  e.registerProcessListeners();

  const app = new Webapp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startUp();
