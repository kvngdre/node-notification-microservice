export class CreateNotificationRequest {
  channel: string;
  data: string;
  retryCount?: number;
  status?: string;
}
