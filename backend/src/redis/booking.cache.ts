import { RedisClient } from "./redis.client";
import type { BookingDTO } from "../types/dto/booking";
import type { TrandingBookingsDTO } from "../types/features/booking";

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
			return bookings as BookingDTO[];
		} catch {
			return null;
		}
	}

	async getTranding(): Promise<TrandingBookingsDTO[] | null> {
		const key = `tranding_bookings`;
		try {
			const bookings = await this.redis.lrange(key);
			if (bookings.length == 0) {
				return null;
			}
			return bookings as TrandingBookingsDTO[];
		} catch {
			return null;
		}
	}

	async setTranding(bookings: TrandingBookingsDTO[]): Promise<void> {
		const key = `tranding_bookings`;
		await this.redis.remove(key);
		for (const booking of bookings) {
			await this.redis.lpushWithTTL(key, booking, bookings.length * 10, this.ttl);
		}
	}

	async invalidateTranding(): Promise<void> {
		const key = `tranding_bookings`;
		await this.redis.remove(key);
	}

	async setForUser(userId: number, bookings: BookingDTO[]): Promise<void> {
		const key = `booking:${userId}`;
		await this.redis.remove(key);
		for (const booking of bookings) {
			await this.redis.rpushWithTTL(key, booking, bookings.length * 10, this.ttl);
		}
	}

	async invalidate(userId: number): Promise<void> {
		const key = `booking:${userId}`;
		await this.redis.remove(key);
	}
}
