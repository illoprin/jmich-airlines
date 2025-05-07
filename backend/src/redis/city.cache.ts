import { RedisClient } from "./redis.client";
import { CityDTO } from "../types/city.type";

export class CityCache {
	private readonly key = "cities";
	private readonly ttl = 86400; // 24 часа
	constructor(private readonly redis: RedisClient) {}

	async getAll(): Promise<CityDTO[] | null> {
		try {
			const { object } = await this.redis.getObject<CityDTO[]>(this.key);
			return object;
		} catch {
			return null;
		}
	}

	async setAll(cities: CityDTO[]): Promise<void> {
		await this.redis.setObjectWithTTL(this.key, cities, this.ttl);
	}

	async invalidate(): Promise<void> {
		await this.redis.remove(this.key);
	}
}
