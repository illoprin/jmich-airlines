import { CityCache } from "../redis/city.cache";
import { CityService } from "../service/city.service";
import cron from "node-cron";

export function scheduleRefreshCities(
	cityCache: CityCache,
	cityService: CityService
): void {
	cron.schedule("0 */15 * * * *", async () => {
		try {
			await cityCache.invalidate();
			await cityService.getAllCities();
		} catch (err) {
			console.error(`failed to refetch cities cache ${(err as Error).message}`);
		}
	});
}