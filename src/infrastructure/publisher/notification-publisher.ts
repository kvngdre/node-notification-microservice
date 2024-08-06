import assert from "assert";
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
  private readonly _routingKey = process.env.RMQ_ROUTING_KEY || "publish_notification";
  private readonly _queue = process.env.RMQ_QUEUE_NAME || "send_notification_queue";
  private _connection: Connection | null = null;
  private _channel: Channel | null = null;

  constructor(private readonly _logger: Logger) {}

  public async publish(data: Notification): Promise<void> {
    try {
      await this._init();

      assert(this._channel, "Channel is null");
      await this._assertExchangeAndQueue();

      this._logger.logDebug("Publishing message...");
      this._channel.publish(this._exchangeName, this._routingKey, this._serializeData(data), {
        persistent: Environment.isProduction
      });

      this._logger.logDebug(" [x] Published %s", data);
    } catch (error) {
      this._logger.logError("Error publishing notification");
      throw error;
    } finally {
      await this._dispose();
    }
  }

  /**
   * Initializes the connection and channel to the message broker.
   */
  private async _init() {
    try {
      const hostname = process.env.RMQ_HOST;
      if (!hostname) {
        throw new Error("Message queue hostname not set.");
      }

      this._connection ??= await connect({
        hostname,
        port: Number(process.env.RMQ_PORT) || 5672
      });

      this._channel ??= await this._connection.createChannel();

      this._logger.logDebug("Established connection to the message broker.");
    } catch (error) {
      this._logger.logError("Error connecting to the message broker.");
      throw error;
    }
  }

  /**
   * Asserts the exchange and queue exist, creating them if necessary.
   */
  private async _assertExchangeAndQueue() {
    if (this._channel == null) return;

    await this._channel.assertExchange(this._exchangeName, this._exchangeType, {
      durable: true
    });
    await this._channel.assertQueue(this._queue, { durable: true });
    await this._channel.bindQueue(this._queue, this._exchangeName, this._routingKey);
  }

  private _serializeData<T>(data: T): Buffer {
    return Buffer.from(JSON.stringify(data));
  }

  private async _dispose() {
    if (this._connection) {
      await this._connection.close();
      this._connection = null;
    }
    if (this._channel) {
      await this._channel.close();
      this._channel = null;
    }
  }
}
