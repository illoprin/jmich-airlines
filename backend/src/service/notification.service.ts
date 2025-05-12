import { NotificationRepository } from "../redis/notification.repository";
import { NotificationEntry } from "../types/repository/notification";

export class NotificationService {
  constructor(private notificationRepo: NotificationRepository) {}

  public async getByUserID(userId: number): Promise<NotificationEntry[]> {
    const notifications = await this.notificationRepo.getNotifications(userId);
    return notifications ?? [];
  }
  public async push(entry: NotificationEntry, userID: number): Promise<void> {
    await this.notificationRepo.pushNotification(entry, userID);
  }
}
