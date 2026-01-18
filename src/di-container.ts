import { Container } from "inversify";
import { registerApplicationServices } from "@application/application-container-registry.js";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-container-registry.js";
import { Environment, ILogger } from "@shared-kernel/index.js";
import { registerWebServices } from "@web/web-container-registry.js";

const container = new Container();

export default container;

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();
  registerWebServices();

  if (Environment.isProduction) {
    console.log("Service registration completed");
  } else {
    container.get<ILogger>("Logger").logInfo("Service registration completed");
  }
}
