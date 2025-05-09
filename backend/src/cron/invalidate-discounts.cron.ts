import cron from "node-cron";
import { DiscountService } from "../service/discount.service";

export function scheduleInvalidateDiscounts(discountService: DiscountService) {
	cron.schedule("0 3 * * *", () => {
		try {
			const deleted = discountService.deleteInvalid();
			console.log(`deleted invalid codes: ${deleted}`);
		} catch (err) {
			console.error(`failed discount invalidation ${(err as Error).message}`);
		}
	});
}