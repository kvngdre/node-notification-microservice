import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { container } from "tsyringe";
import { registerServices } from "./dependency-injection";
import WebApp from "./web/web-app";
import { GlobalErrorHandler } from "./web/utils/global-error-handler";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";
import { Server } from "http";
// import { DeadLetterQueueConsumer } from "@infrastructure/consumer";

async function startup() {
  registerServices();

  await container.resolve(GlobalErrorHandler).registerProcessListeners();

  await container.resolve(ApplicationDbContext).connect();

  // await container.resolve(DeadLetterQueueConsumer).consume();

  const app = new WebApp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startup();

function registerGlobalProcessListeners(server: Server) {
  // Register global process listeners first
  process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      process.exit(0);
    });
  });
}
