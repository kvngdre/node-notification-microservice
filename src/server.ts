import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
// import WebApp from "./web/web-app";
import { DatabaseContext } from "@infrastructure/database/database-context";
import container from "./di-container";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-container-registry";
import { registerApplicationServices } from "@application/application-container-registry";
import { registerWebServices } from "@web/web-container-registry";
// import { DeadLetterQueueConsumer } from "@infrastructure/consumer";

async function startup() {
  registerInfrastructureServices();
  console.log("Infrastructure layer services registered");

  registerApplicationServices();
  console.log("Application layer services registered");

  registerWebServices();

  // Connect to the database
  await container.get<DatabaseContext>("DatabaseContext").connect();

  // await container.resolve(DeadLetterQueueConsumer).consume();

  // const app = new WebApp({
  //   port: Number(process.env.PORT)
  // });

  // app.run();

  // return app;
}

export default startup();
