import { Column, Entity, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import { NotificationChannel } from "./types/notification-channel-type";
import { NotificationStatus, NotificationStatusType } from "./types/notification-status-type";
import { NotificationChannelType } from "./types/notification-channel-type";
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
  public status: NotificationStatusType;

  @Column({
    type: "enum",
    enum: NotificationChannel
  })
  public channel: NotificationChannelType;

  @Column("text")
  public data: string;

  @Column({
    name: "retry_count",
    default: 0,
    type: "int4"
  })
  public retryCount: number;

  @Column({
    name: "created_at",
    type: "timestamp with time zone"
  })
  public createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp with time zone"
  })
  public updatedAt: Date;

  constructor(
    channel: NotificationChannelType,
    data: string,
    status: NotificationStatusType = NotificationStatus.PENDING,
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
