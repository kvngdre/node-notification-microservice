import { Lifecycle, scoped } from "tsyringe";
import { INotificationRepository, Notification } from "@domain/notification";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";

@scoped(Lifecycle.ResolutionScoped)
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

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
