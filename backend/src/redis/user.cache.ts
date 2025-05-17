import { RedisClient } from "./redis.client";
import type { UserEntry } from "@/types/repository/user";

export class UserCache {
  private readonly ttl = 3600; // one hour
  constructor(private readonly redis: RedisClient) {}

  async get(id: number): Promise<UserEntry | null> {
    const key = `user:${id}`;
    try {
      const { object } = await this.redis.getObject<UserEntry>(key);
      return object;
    } catch {
      return null;
    }
  }

  async set(id: number, user: UserEntry): Promise<void> {
    const key = `user:${id}`;
    await this.redis.setObjectWithTTL(key, user, this.ttl);
  }

  async invalidate(id: number): Promise<void> {
    const key = `user:${id}`;
    await this.redis.remove(key);
  }
}
