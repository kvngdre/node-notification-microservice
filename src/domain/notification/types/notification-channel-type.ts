export const NotificationChannel = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  PUSH: "PUSH"
} as const;

export type NotificationChannelType =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];
