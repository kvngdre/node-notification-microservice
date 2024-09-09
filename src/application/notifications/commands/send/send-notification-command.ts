import { NotificationChannel } from "@domain/notifications";
import { IRequest } from "@infrastructure/mediator/request-interface";

export class SendNotificationCommand implements IRequest {
  constructor(
    public readonly channel: NotificationChannel,
    public readonly data: NotificationData<typeof channel>
  ) {}
}

export type NotificationDataType =
  | IEmailNotificationData
  | ISMSNotificationData
  | IPushNotificationData;

type NotificationData<T> = T extends NotificationChannel.EMAIL
  ? IEmailNotificationData
  : T extends NotificationChannel.SMS
    ? ISMSNotificationData
    : T extends NotificationChannel.PUSH
      ? IPushNotificationData
      : never;

interface IEmailNotificationData {
  alias: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

interface ISMSNotificationData {
  to: string;
  body: string;
}

interface IPushNotificationData {
  deviceToken: string;
  title: string;
  body: string;
  imageUrl?: string;
}
