import { mockNotifications } from "@/api/mocks/notification";
import type { Notification } from "@/api/types/entities/notification";

export class UserNotificationAPI {
  public static async getForUser(token: string): Promise<Notification[]> {
    return mockNotifications;
  }

  public static async pushToUser(user_id: number, token: string): Promise<void> {

  }
}