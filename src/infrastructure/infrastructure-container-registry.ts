import container from "../di-container.js";
import { Logger } from "./logging/logger.js";
import { ILogger } from "@shared-kernel/logger-interface.js";
import DatabaseContext from "./database/database-context.js";
import { NotificationRepository } from "./repositories/notification-repository.js";
import { INotificationRepository } from "@domain/notification/notification-repository-interface.js";
import { NotificationPublisher } from "./publisher/notification-publisher.js";
import { DeadLetterQueueConsumer } from "./consumers/dead-letter-queue-consumer.js";

export function registerInfrastructureServices() {
  container.bind<ILogger>("Logger").to(Logger).inSingletonScope();
  container.bind(DatabaseContext).toSelf().inSingletonScope();
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
