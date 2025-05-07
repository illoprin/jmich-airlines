import { RedisClient } from "./redis.client";
import { BookingDTO } from "../types/booking.type";

export class BookingCache {
	private readonly ttl = 1800; // 30 минут
	constructor(private readonly redis: RedisClient) {}

	async getByUser(userId: number): Promise<BookingDTO[] | null> {
		const key = `booking:${userId}`;
		try {
			const bookings = await this.redis.lrange(key);
			if (bookings.length == 0) {
				return null;
			}
			// FIX: bookings represented in redis as array
			// but when array is not set, redis returns empty array
			return bookings as BookingDTO[];
		} catch {
			return null;
		}
	}

	async setForUser(userId: number, bookings: BookingDTO[]): Promise<void> {
		const key = `booking:${userId}`;
		await this.redis.remove(key);
		for (const booking of bookings) {
			await this.redis.rpushWithTTL(key, booking, 100, this.ttl);
		}
	}

	async invalidate(userId: number): Promise<void> {
		const key = `booking:${userId}`;
		await this.redis.remove(key);
	}
}
