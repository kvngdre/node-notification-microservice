export interface CreateNotificationRequest {
  channel: string;
  data: string;
  retryCount?: number;
  status?: string;
}
