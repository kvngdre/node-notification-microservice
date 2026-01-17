import { container, Lifecycle } from "tsyringe";
import { Logger } from "./logging";
import { ILogger } from "@application/abstractions/logging/logger-interface";
import { ApplicationDbContext } from "./database/application-db-context";
import { NotificationRepository } from "./repositories";
import { INotificationRepository } from "@domain/notifications";
import { Mediator } from "./mediator/mediator.js";
import { IMediator } from "@shared-kernel/mediator-interface";
import { NotificationPublisher } from "./publisher";
import { DeadLetterQueueConsumer } from "./consumer/dead-letter-queue-consumer";

export function registerInfrastructureServices() {
  container.registerSingleton<IMediator>("Mediator", Mediator);
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);
  container.register<INotificationRepository>("NotificationRepository", NotificationRepository, {
    lifecycle: Lifecycle.ResolutionScoped
  });
  container.registerSingleton("NotificationPublisher", NotificationPublisher);
  container.registerSingleton("DeadLetterQueueConsumer", DeadLetterQueueConsumer);
}
