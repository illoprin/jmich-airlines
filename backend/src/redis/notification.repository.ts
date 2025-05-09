import { HOUR_MILLISECONDS } from "../lib/service/const";
import { NotificationEntry } from "../types/repository/notification";
import { RedisClient } from "./redis.client";

export class NotificationRepository {
	private ttl: number;
	private maxLength: number;
	constructor(private redisClient: RedisClient) {
		// Lifetime of notifications is 3 days
		this.ttl = HOUR_MILLISECONDS * 24 * 3;
		// Max length of notifications array for each user
		this.maxLength = 32;
	}

	private getUserNotificationKey(userID: number): string {
		return `user:notifications:${userID}`;
	}

	public async pushNotification(
		entry: NotificationEntry,
		userID: number
	): Promise<void> {
		await this.redisClient.lpushWithTTL(
			this.getUserNotificationKey(userID),
			entry,
			this.maxLength,
			this.ttl
		);
	}

	public async getNotifications(
		userID: number
	): Promise<NotificationEntry[] | null> {
		try {
			const notifications = (await this.redisClient.lrange(
				this.getUserNotificationKey(userID)
			)) as NotificationEntry[];
			return notifications;
		} catch {
			return null;
		}
	}
}
