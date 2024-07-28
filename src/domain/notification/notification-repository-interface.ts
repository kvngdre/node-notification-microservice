import { Notification } from "./notification";

export interface INotificationRepository<T = Notification> {
  insert(notification: T): Promise<T>;
  find(query: object): Promise<Array<T>>;
  findById(id: string): Promise<T | null>;
  update(notification: T): Promise<T>;
  remove(notification: T): Promise<T | null>;
}
