import { container, Lifecycle } from "tsyringe";
import { Logger } from "./logging";
import { ILogger } from "@application/abstractions/logging/logger-interface";
import { ApplicationDbContext } from "./database/application-db-context";
import { NotificationRepository } from "./repositories";
import { INotificationRepository } from "@domain/notification";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);

  container.register<INotificationRepository>("NotificationRepository", NotificationRepository, {
    lifecycle: Lifecycle.ResolutionScoped
  });
}
