import { NotificationChannelType } from "./notification-channel-type.js";

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

export type NotificationData<T extends NotificationChannelType> = T extends "EMAIL"
  ? IEmailNotificationData
  : T extends "SMS"
    ? ISMSNotificationData
    : T extends "PUSH"
      ? IPushNotificationData
      : never;
