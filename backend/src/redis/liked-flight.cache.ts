import { HOUR_SECONDS } from "../lib/service/const";
import type { FlightDTO } from "../types/dto/flight";
import type { RedisClient } from "./redis.client";

export class LikedFlightCache {
  private readonly ttl: number = HOUR_SECONDS * 3; // 3 hours
  private readonly keyPrefix = "liked_flights";
  private maxLength: number;

  constructor(private redisClient: RedisClient) {}

  private getKey(userID: number): string {
    return `user:${userID}:${this.keyPrefix}`;
  }

  public async get(userID: number): Promise<FlightDTO[] | null> {
    try {
      const { object } = await this.redisClient.getObject<FlightDTO[]>(
        this.getKey(userID),
      );
      if (object) {
        return object.map((dto) => ({
          ...dto,
          departure_date: new Date(dto.departure_date),
          arrival_date: new Date(dto.arrival_date),
        }));
      }
      return null;
    } catch {
      return null;
    }
  }

  public async set(userID: number, flights: FlightDTO[]): Promise<void> {
    await this.redisClient.setObjectWithTTL(
      this.getKey(userID),
      flights,
      this.ttl,
    );
  }

  public async invalidate(userID: number): Promise<void> {
    await this.redisClient.remove(this.getKey(userID));
  }
}
