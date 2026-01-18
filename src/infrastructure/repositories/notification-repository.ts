import { inject, injectable } from "inversify";
import { INotificationRepository, Notification } from "@domain/notification/index.js";
import DatabaseContext from "@infrastructure/database/database-context.js";

@injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(@inject(DatabaseContext) private readonly _dbContext: DatabaseContext) {}

  public async save(notification: Notification): Promise<Notification> {
    return this._dbContext.notifications.save(notification);
  }

  public async find(query: any = {}): Promise<Array<Notification>> {
    const queryBuilder = this._dbContext.notifications
      .createQueryBuilder("notification")
      .orderBy("notification.created_at", "DESC");

    // Apply filters if provided
    if (query.channel) {
      queryBuilder.andWhere("notification.channel = :channel", { channel: query.channel });
    }

    if (query.status) {
      queryBuilder.andWhere("notification.status = :status", { status: query.status });
    }

    // Apply pagination if provided
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    return queryBuilder.getMany();
  }

  public async findById(id: string): Promise<Notification | null> {
    return this._dbContext.notifications.findOneBy({ id });
  }

  public async remove(notification: Notification): Promise<Notification | null> {
    return this._dbContext.notifications.remove(notification);
  }
}
