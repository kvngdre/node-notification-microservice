import { inject, injectable } from "inversify";
import { INotificationRepository, Notification } from "@domain/notifications";
import { DatabaseContext } from "@infrastructure/database/database-context";

@injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(@inject(DatabaseContext) private readonly _dbContext: DatabaseContext) {}

  public async save(notification: Notification): Promise<Notification> {
    return this._dbContext.notifications.save(notification);
  }

  public async find(query: object): Promise<Array<Notification>> {
    return this._dbContext.notifications
      .createQueryBuilder("notification")
      .orderBy({ created_at: "DESC" })
      .getMany();
  }

  public async findById(id: string): Promise<Notification | null> {
    return this._dbContext.notifications.findOneBy({ id });
  }

  public async remove(notification: Notification): Promise<Notification | null> {
    return this._dbContext.notifications.remove(notification);
  }
}
