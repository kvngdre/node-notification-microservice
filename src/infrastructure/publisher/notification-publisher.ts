import { Channel, connect, Connection } from "amqplib";
import { singleton } from "tsyringe";
import { IPublisher } from "@application/abstractions/publisher";
import { Notification } from "@domain/notifications";
import { Logger } from "@infrastructure/logging";
import { Environment } from "@shared-kernel/environment";

@singleton()
export class NotificationPublisher implements IPublisher<Notification> {
  private readonly _exchangeName = process.env.RMQ_EXCHANGE_NAME || "notification_events";
  private readonly _exchangeType = process.env.RMQ_EXCHANGE_TYPE || "direct";
  private readonly _routingKey = process.env.RMQ_MAIN_QUEUE_ROUTING_KEY || "publish_notification";
  private readonly _queue = process.env.RMQ_MAIN_QUEUE_NAME || "send_notification_queue";
  private readonly _dlqRoutingKey = process.env.RMQ_DLQ_ROUTING_KEY || "send_notification_dlq";
  private readonly _rmqHostname = process.env.RMQ_HOST || "localhost";
  private readonly _rmqPort = process.env.RMQ_PORT || 5672;
  private _connection: Connection | null = null;

  constructor(private readonly _logger: Logger) {}

  public async publish(data: Notification): Promise<void> {
    try {
      const connection = await this._getConnection();

      const channel = await connection.createChannel();

      await this._assertExchangeAndQueue(channel);

      this._logger.logDebug("Publishing message...");

      channel.publish(this._exchangeName, this._routingKey, this._serializeData(data), {
        persistent: Environment.isProduction
      });

      this._logger.logDebug("[x] Published", data);
    } catch (error) {
      this._logger.logError("Error publishing notification");
      throw error;
    }
  }

  /**
   * Initializes the connection to the message broker.
   */
  private async _getConnection() {
    if (this._connection === null) {
      this._connection = await connect({
        hostname: this._rmqHostname,
        port: Number(this._rmqPort) ?? 5672,
        username: "guest",
        password: "guest"
      });
    }

    this._logger.logDebug("Established connection to the message broker.");

    return this._connection;
  }

  /**
   * Asserts the exchange and queue exist, creating them if necessary.
   */
  private async _assertExchangeAndQueue(channel: Channel): Promise<void> {
    if (channel == null) return;

    await channel.assertExchange(this._exchangeName, this._exchangeType, {
      durable: true
    });
    await channel.assertQueue(this._queue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": this._exchangeName,
        "x-dead-letter-routing-key": this._dlqRoutingKey
      }
    });
    await channel.bindQueue(this._queue, this._exchangeName, this._routingKey);
  }

  private _serializeData<T>(data: T): Buffer {
    return Buffer.from(JSON.stringify(data));
  }
}
