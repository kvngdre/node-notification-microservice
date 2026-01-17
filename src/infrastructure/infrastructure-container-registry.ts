import container from "../di-container";
import { Logger } from "./logging";
import { ILogger } from "@shared-kernel/logger-interface";
import { DatabaseContext } from "./database/database-context";
import { NotificationRepository } from "./repositories";
import { INotificationRepository } from "@domain/notifications";
import { Mediator } from "./mediator/mediator";
import { IMediator } from "@shared-kernel/mediator-interface";
import { NotificationPublisher } from "./publisher";
import { DeadLetterQueueConsumer } from "./consumer/dead-letter-queue-consumer";

export function registerInfrastructureServices() {
  console.log("Registering Mediator...");
  container.bind<IMediator>("Mediator").to(Mediator).inSingletonScope();
  container.bind<ILogger>("Logger").to(Logger).inSingletonScope();
  container.bind<DatabaseContext>("DatabaseContext").to(DatabaseContext).inSingletonScope();
  container
    .bind<INotificationRepository>("NotificationRepository")
    .to(NotificationRepository)
    .inRequestScope();
  container
    .bind<NotificationPublisher>("NotificationPublisher")
    .to(NotificationPublisher)
    .inSingletonScope();
  container
    .bind<DeadLetterQueueConsumer>("DeadLetterQueueConsumer")
    .to(DeadLetterQueueConsumer)
    .inSingletonScope();
}
