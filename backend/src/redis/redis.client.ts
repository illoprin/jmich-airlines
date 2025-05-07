import { createClient, RedisClientType } from "redis";

/**
 * Thrown when a Redis key is invalid or inaccessible.
 */
export class RedisInvalidKey extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RedisInvalidKey";
	}
}

/**
 * Thrown when JSON parsing of a Redis value fails.
 */
export class RedisInvalidJSON extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RedisInvalidJSON";
	}
}

/**
 * A wrapper around Redis client with typed methods and error handling.
 */
export class RedisClient {
	private client: RedisClientType;
	private url: string;

	/**
	 * Creates a Redis client instance.
	 * @param host Redis server host (default: localhost)
	 * @param port Redis server port (default: 6379)
	 */
	constructor(host = "localhost", port = 6379) {
		this.url = `redis://${host}:${port}`;
		this.client = createClient({ url: this.url });
	}

	/**
	 * Initializes the Redis connection.
	 * Also sets a temporary key to verify connectivity.
	 */
	async init(): Promise<void> {
		this.client.on("error", (err: Error) => {
			console.error("redis client error:", err);
		});

		try {
			await this.client.connect();
			console.log(`connected to redis at ${this.url}`);
			await this.client.setEx("server", 10, "jmich.airlines connection");
		} catch (err) {
			console.error("failed to connect to redis:", err);
			throw err;
		}
	}

	/**
	 * Retrieves a string value and its TTL for a given key.
	 * @param key The Redis key
	 * @returns An object with the value and TTL in seconds
	 */
	async get(key: string): Promise<{ data: string | null; ttl: number }> {
		try {
			const data = await this.client.get(key);
			const ttl = await this.client.ttl(key);
			return { data, ttl };
		} catch (err) {
			throw new RedisInvalidKey(
				`failed to get key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Deletes a key from Redis.
	 * @param key The Redis key
	 */
	async remove(key: string): Promise<void> {
		try {
			await this.client.del(key);
		} catch (err) {
			throw new RedisInvalidKey(
				`failed to remove key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Sets a string value with a TTL.
	 * @param key The Redis key
	 * @param ttl Time-to-live in seconds
	 * @param value The string value
	 */
	async setWithTTL(key: string, ttl: number, value: string): Promise<void> {
		try {
			await this.client.setEx(key, ttl, value);
		} catch (err) {
			throw new RedisInvalidKey(
				`failed to set key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Retrieves a JSON-parsed object and its TTL by key.
	 * @param key The Redis key
	 * @returns The parsed object and TTL
	 */
	async getObject<T = unknown>(
		key: string
	): Promise<{ object: T; ttl: number }> {
		try {
			const data = await this.client.get(key);
			if (!data) {
				throw new RedisInvalidKey(`key "${key}" does not exist or has expired`);
			}

			const ttl = await this.client.ttl(key);

			try {
				const obj = JSON.parse(data) as T;
				return { object: obj, ttl };
			} catch (jsonErr) {
				throw new RedisInvalidJSON(
					`failed to parse json for key "${key}": ${(jsonErr as Error).message}`
				);
			}
		} catch (err) {
			if (err instanceof RedisInvalidJSON) throw err;
			throw new RedisInvalidKey(
				`error getting object for key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Stores an object in Redis as a JSON string with a TTL.
	 * @param key The Redis key
	 * @param value The object to store
	 * @param ttl Time-to-live in seconds
	 */
	async setObjectWithTTL(
		key: string,
		value: unknown,
		ttl: number
	): Promise<void> {
		try {
			const strVal = JSON.stringify(value);
			await this.client.setEx(key, ttl, strVal);
		} catch (err) {
			throw new RedisInvalidKey(
				`failed to set object for key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Pushes a JSON object to the head of a list (LPUSH),
	 * trims the list to a max length, and sets TTL.
	 * @param key The list key
	 * @param value The value to push
	 * @param maxLength Max list size (default: 50)
	 * @param ttl Time-to-live in seconds (default: 86400)
	 */
	async lpushWithTTL(
		key: string,
		value: unknown,
		maxLength = 50,
		ttl = 86400
	): Promise<void> {
		try {
			const stringified = JSON.stringify(value);
			await this.client.lPush(key, stringified);
			await this.client.lTrim(key, 0, maxLength - 1);
			await this.client.expire(key, ttl);
		} catch (err) {
			throw new RedisInvalidKey(
				`lpush failed for key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Pushes a JSON object to the end of a list (RPUSH),
	 * trims the list to a max length, and sets TTL.
	 * @param key The list key
	 * @param value The value to push
	 * @param maxLength Max list size (default: 50)
	 * @param ttl Time-to-live in seconds (default: 86400)
	 */
	async rpushWithTTL(
		key: string,
		value: unknown,
		maxLength = 50,
		ttl = 86400
	): Promise<void> {
		try {
			const stringified = JSON.stringify(value);
			await this.client.rPush(key, stringified);
			await this.client.lTrim(key, -maxLength, -1);
			await this.client.expire(key, ttl);
		} catch (err) {
			throw new RedisInvalidKey(
				`rpush failed for key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Returns a range of items from a list,
	 * parsing them from JSON if possible.
	 * @param key The list key
	 * @param start Start index (default: 0)
	 * @param end End index (default: -1, all items)
	 * @returns Array of values (parsed or raw)
	 */
	async lrange(key: string, start = 0, end = -1): Promise<any[]> {
		try {
			const list = await this.client.lRange(key, start, end);
			return list.map((item) => {
				try {
					return JSON.parse(item);
				} catch {
					return item;
				}
			});
		} catch (err) {
			throw new RedisInvalidKey(
				`lrange failed for key "${key}": ${(err as Error).message}`
			);
		}
	}

	/**
	 * Gracefully closes the Redis connection.
	 */
	async disconnect(): Promise<void> {
		try {
			await this.client.quit();
			console.log("redis disconnected");
		} catch (err) {
			console.error("failed to disconnect redis:", err);
		}
	}
}
