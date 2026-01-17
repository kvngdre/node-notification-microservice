import { container } from "tsyringe";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-container-registry";
import { registerApplicationServices } from "@application/application-container-registry";
import { GlobalErrorHandler } from "./web/utils/global-error-handler";
import { ILogger } from "@application/abstractions/logging";
import { registerWebServices } from "./web/web-container-registry";

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();
  registerWebServices();

  container.registerSingleton("GlobalErrorHandler", GlobalErrorHandler);

  container.resolve<ILogger>("Logger").logDebug("Services registration complete...✅");
}
