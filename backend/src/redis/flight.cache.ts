import { RedisClient } from "./redis.client";
import { FlightDTO } from "../types/flight.type";

export class FlightCache {
	private readonly ttl = 3600;
	constructor(private readonly redis: RedisClient) {}

	async get(id: number): Promise<FlightDTO | null> {
		const key = `flight:${id}`;
		try {
			const { object } = await this.redis.getObject<FlightDTO>(key);
			return object;
		} catch {
			return null;
		}
	}

	async set(id: number, flight: FlightDTO): Promise<void> {
		const key = `flight:${id}`;
		await this.redis.setObjectWithTTL(key, flight, this.ttl);
	}

	async invalidate(id: number): Promise<void> {
		const key = `flight:${id}`;
		await this.redis.remove(key);
	}
}
