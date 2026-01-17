import { registerApplicationServices } from "@application/application-container-registry";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-container-registry";
import { registerWebServices } from "@web/web-container-registry";
import { Container } from "inversify";

const container = new Container();

export default container;

export function registerServices() {
  registerInfrastructureServices();
  console.log(">> Infrastructure layer services registered");

  registerApplicationServices();
  console.log(">> Application layer services registered");

  registerWebServices();
  console.log(">> Web layer services registered");
}
