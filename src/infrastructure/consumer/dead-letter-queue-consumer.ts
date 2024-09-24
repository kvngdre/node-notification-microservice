import { inject, singleton } from "tsyringe";
import { Channel, connect, Connection, ConsumeMessage } from "amqplib";
import { IConsumer } from "@application/abstractions/consumer/consumer-interface";
import { INotificationRepository } from "@domain/notifications/notification-repository-interface";
import { ILogger } from "@application/abstractions/logging";
import { Notification, NotificationStatus } from "@domain/notifications";
import { Environment } from "@shared-kernel/environment";
import { IDateTimeProvider } from "@shared-kernel/date-time-provider-interface";

@singleton()
export class DeadLetterQueueConsumer implements IConsumer {
  private readonly _exchangeName = process.env.RMQ_EXCHANGE_NAME || "notification_events";
  private readonly _exchangeType = process.env.RMQ_EXCHANGE_TYPE || "direct";
  private readonly _dlqRoutingKey = process.env.RMQ_DLQ_ROUTING_KEY || "failed_notification";
  private readonly _dlqQueue = process.env.RMQ_DLQ_QUEUE || "send_notification_dlq";
  private readonly _mainQueue = process.env.RMQ_MAIN_QUEUE || "send_notification_queue";
  private readonly _retryLimit = Number(process.env.RETRY_LIMIT) || 3;
  private readonly _rmqHostname = process.env.RMQ_HOST || "localhost";
  private readonly _rmqPort = process.env.RMQ_PORT || 5672;
  private _connection: Connection | null = null;

  constructor(
    @inject("Logger") private readonly _logger: ILogger,
    @inject("NotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("DateTimeProvider") private readonly _dateTimeProvider: IDateTimeProvider
  ) {}

  public async consume(): Promise<void> {
    // Connect to RabbitMQ
    const connection = await this._getConnection();

    const channel = await connection!.createChannel();

    // Assert the DLQ Queue exists
    await channel.assertExchange(this._exchangeName, this._exchangeType, {
      durable: true
    });
    await channel.assertQueue(this._dlqQueue, { durable: true });
    await channel.bindQueue(this._dlqQueue, this._exchangeName, this._dlqRoutingKey);

    // Start consuming messages from the DLQ
    channel.consume(
      this._dlqQueue,
      async (msg: ConsumeMessage | null) => {
        if (msg === null) return;

        try {
          const notification: Notification = JSON.parse(msg.content.toString());

          this._logger.logInfo(
            `DLQ message received: ${notification}, Retry Count: ${notification.retryCount}`
          );

          // Update database with retry attempt
          notification.retryCount += 1;
          notification.updatedAt = this._dateTimeProvider.utcNow();
          await this._notificationRepository.save(notification);

          if (notification.retryCount < this._retryLimit) {
            // If retry limit not reached, requeue the message
            this._requeueMessage(channel, msg, notification);

            this._logger.logDebug("Requeued the notification");
          } else {
            // If retry limit is reached, mark the message as permanently failed
            notification.status = NotificationStatus.FAILED;
            notification.updatedAt = this._dateTimeProvider.utcNow();
            await this._notificationRepository.save(notification);

            this._logger.logDebug("Notification marked as failure");

            channel.ack(msg); // Acknowledge the message to remove it from DLQ
          }
        } catch (error) {
          if (error instanceof Error) {
            this._logger.logError(
              `Failed to process DLQ message. Reason -> ${error.message}`,
              error.stack
            );
          }

          // nack without requeue if processing fails
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );

    process.on("SIGTERM", async () => {
      this._logger.logInfo("Received SIGTERM, shutting down gracefully");
      await channel.close();
      await connection!.close();
    });

    this._logger.logInfo("Dead Letter Queue Consumer running...🚀");
  }

  private async _getConnection() {
    try {
      if (this._connection === null) {
        this._connection = await connect({
          hostname: this._rmqHostname,
          port: Number(this._rmqPort) ?? 5672,
          username: "guest",
          password: "guest"
        });
      }

      return this._connection;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `DeadLetterQueueConsumer failed to connect to MQ. Reason: ${error.message}`
        );
      }
    }
  }

  // Requeue the message back to the main notification queue with updated retry count
  private _requeueMessage(channel: Channel, msg: ConsumeMessage, notification: Notification) {
    channel.sendToQueue(this._mainQueue, Buffer.from(JSON.stringify(notification)), {
      persistent: Environment.isProduction
    });

    channel.ack(msg); // Acknowledge the message to remove it from DLQ

    this._logger.logInfo(
      `Requeued message to main queue with retry count: ${notification.retryCount}`
    );
  }
}
