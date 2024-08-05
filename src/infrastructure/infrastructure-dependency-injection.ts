import { container, Lifecycle } from "tsyringe";
import { Logger } from "./logging";
import { ILogger } from "@application/abstractions/logging/logger-interface";
import { ApplicationDbContext } from "./database/application-db-context";
import { NotificationRepository } from "./repositories";
import { INotificationRepository } from "@domain/notifications";
import { Mediator } from "./mediator";
import { IMediator } from "@shared-kernel/mediator-interface";
import { IDateTimeProvider } from "@shared-kernel/date-time-provider-interface";
import { DateTimeProvider } from "./time";
import { NotificationPublisher } from "./publisher";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);
  container.registerSingleton<IMediator>("Mediator", Mediator);
  container.registerSingleton<IDateTimeProvider>("DateTimeProvider", DateTimeProvider);

  container.register<INotificationRepository>("NotificationRepository", NotificationRepository, {
    lifecycle: Lifecycle.ResolutionScoped
  });
  container.registerSingleton("NotificationPublisher", NotificationPublisher);
}
