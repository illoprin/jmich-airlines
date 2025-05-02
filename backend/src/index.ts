import { readConfig } from "./config/config";
import type { Config } from "./types/config.type";
import { App } from "./app";
import { initRouter } from "./router";
import { initStorage } from "./storage";
import { initServices } from "./service";

function main() {
	// Load config
	const cfg: Config = readConfig("./config/local.yaml");
	console.log("config loaded:", cfg);

	// Init storage
	const storage = initStorage(cfg.storage_path);

	// Connect to Redis server
	/* const redisClient = createClient({
		url: `redis://${cfg.redis_server.host}:${cfg.redis_server.port}`,
	})
		.on("error", (err: Error) => console.error("redis connection error", err))
		.connect();
	console.log("redis cache connected"); */

	// Create services
	const services = initServices(storage.repositories, cfg);

	// Init router
	const router = initRouter();

	setInterval(() => {
		try {
			console.log(
				"Update flights and booking statuses:\n" +
					"\tFlights updated %d\n" +
					"\tBookings updated: %d\n",
				services.flightService.completeExpired(),
				services.bookingService.completeExpired()
			);
		} catch (err) {
			console.error((err as any).code);
		}
	}, 10_000);

	// Create app
	const app = new App(services, cfg, router);
	app.start();
}

main();
