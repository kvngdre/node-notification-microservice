export interface CreateNotificationRequest {
  channel: string;
  data: string;
  status?: string;
  retryCount?: number;
}
