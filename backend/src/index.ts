import { readConfig } from "./config/config";
import type { Config } from "./types/internal/config";
import { App } from "./app";
import { initRouter } from "./router";
import { initStorage } from "./storage";
import { initServices } from "./service";
import { scheduleUpdateStatus } from "./cron/update-status.cron";
import { scheduleInvalidateDiscounts } from "./cron/invalidate-discounts.cron";
import { scheduleRefreshCities } from "./cron/update-cities-cache.cron";
import { scheduleIncreasePrice } from "./cron/increase-price.cron";

async function main() {
	// Load config
	const cfg: Config = readConfig("./config/local.yaml");
	console.log("config loaded:", cfg);

	// Init storage
	const storage = initStorage(
		cfg.storage_path,
		cfg.redis_server.host,
		cfg.redis_server.port
	);
	await storage.redisClient.init();

	// Create services
	const services = initServices(storage.repositories, cfg);

	// Init router
	const router = initRouter();

	// Schedule cron jobs (periodic execution of some task)
	scheduleUpdateStatus(services.flightService, services.bookingService);
	scheduleInvalidateDiscounts(services.discountService);
	scheduleRefreshCities(storage.repositories.cityCache, services.cityService);
	scheduleIncreasePrice(services.flightService);

	// Create app
	const app = new App(services, cfg, router);
	app.start();
}

(async () => {
	try {
		await main();
	} catch (err) {
		if (err instanceof Error) {
			console.error(`api failed to start: ${err.message}`);
		}
	}
})();
