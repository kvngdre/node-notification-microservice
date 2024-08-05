import { Column, Entity, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import { NotificationChannel } from "./notification-channel";
import { NotificationStatus } from "./notification-status";

@Entity("notifications")
export class Notification {
  @PrimaryColumn({
    type: "text"
  })
  public id: string = ulid();

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.PENDING
  })
  public status: NotificationStatus;

  @Column({
    type: "enum",
    enum: NotificationChannel
  })
  public channel: NotificationChannel;

  @Column("text")
  public data: string;

  @Column({
    name: "retry_count",
    default: 0
  })
  public retryCount: number;

  @Column({
    name: "created_at"
  })
  public createdAt: Date;

  @Column({
    name: "updated_at"
  })
  public updatedAt: Date;

  constructor(
    channel: NotificationChannel,
    data: string,
    status: NotificationStatus = NotificationStatus.PENDING,
    retryCount: number = 0
  ) {
    this.channel = channel;
    this.data = data;
    this.status = status;
    this.retryCount = retryCount;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
