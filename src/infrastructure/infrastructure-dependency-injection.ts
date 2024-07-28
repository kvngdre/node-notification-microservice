import { container } from "tsyringe";
import { Logger } from "./logging";
import { ILogger } from "@application/abstractions/logging/logger-interface";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
}
