import { INotificationRepository, Notification } from "@domain/notification";

export class NotificationRepository implements INotificationRepository {
  public async insert(notification: Notification): Promise<Notification> {
    throw new Error("Method not implemented.");
  }
  find(query: object): Promise<Array<Notification>> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Notification | null> {
    throw new Error("Method not implemented.");
  }
  update(notification: Notification): Promise<Notification> {
    throw new Error("Method not implemented.");
  }
  remove(notification: Notification): Promise<Notification | null> {
    throw new Error("Method not implemented.");
  }
}
