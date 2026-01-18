import container from "../di-container";
import { Logger } from "./logging/logger";
import { ILogger } from "@shared-kernel/logger-interface";
import DatabaseContext from "./database/database-context";
import { NotificationRepository } from "./repositories";
import { INotificationRepository } from "@domain/notification";
import { NotificationPublisher } from "./publisher/notification-publisher";
import { DeadLetterQueueConsumer } from "./consumers/dead-letter-queue-consumer";

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
