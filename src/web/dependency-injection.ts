import { container } from "tsyringe";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { registerApplicationServices } from "@application/application-dependency-injection";
import { GlobalErrorHandler } from "./utils/global-error-handler";
import { ILogger } from "@application/abstractions/logging";
import { registerMiddleware } from "./middleware/DI";

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();
  registerMiddleware();

  container.registerSingleton("GlobalErrorHandler", GlobalErrorHandler);

  container.resolve<ILogger>("Logger").logDebug("Services registration complete...✅");
}
