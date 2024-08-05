import { Notification } from "./notification-entity";

export interface INotificationRepository<T = Notification> {
  save(notification: T): Promise<T>;
  find(query: object): Promise<Array<T>>;
  findById(id: string): Promise<T | null>;
  remove(notification: T): Promise<T | null>;
}
