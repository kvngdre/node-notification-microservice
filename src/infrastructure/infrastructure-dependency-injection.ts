import { container } from "tsyringe";
import { Logger } from "./logger";
import { ILogger } from "../shared-kernel/interfaces";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
}
