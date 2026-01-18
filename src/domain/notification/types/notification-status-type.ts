export const NotificationStatus = {
  FAILED: "FAILED",
  PENDING: "PENDING",
  SENT: "SENT",
  UNDELIVERED: "UNDELIVERED",
  QUEUED: "QUEUED"
} as const;

export type NotificationStatusType = (typeof NotificationStatus)[keyof typeof NotificationStatus];
