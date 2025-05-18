import { $authHost } from "@/api/httpClient";
import type { Notification } from "@/api/types/entities/notification";

export class UserNotificationAPI {
  public static async getForUser(): Promise<Notification[]> {
    const response = await $authHost.get('user/notification');
    const { notifications } = (await response.json() as any);
    return notifications;
  }

  public static async pushToUser(user_id: number, notification: Notification): Promise<void> {
    await $authHost.post(`user/notification/${user_id}`, {
      json: notification,
    });
  }
}