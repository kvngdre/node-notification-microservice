import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import "./dependency-injection";
import Webapp from "./webapp";

async function startUp() {
  const app = new Webapp({
    port: Number(process.env.PORT)
  });
  app.run();

  return app;
}

export default startUp();
