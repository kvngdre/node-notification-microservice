import { registerApplicationServices } from "@application/application-container-registry";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-container-registry";
import { Environment } from "@shared-kernel/environment";
import { ILogger } from "@shared-kernel/logger-interface";
import { registerWebServices } from "@web/web-container-registry";
import { Container } from "inversify";

const container = new Container();

export default container;

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();
  registerWebServices();

  Environment.isProduction
    ? console.log("Service registration completed")
    : container.get<ILogger>("Logger").logInfo("Service registration completed");
}
