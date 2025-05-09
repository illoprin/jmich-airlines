import cron from "node-cron";
import { NotificationService } from "@/service/notification.service";
import { LikedFlightRepository } from "@/repository/liked-flight.repository";
import { LowSeatWarningHandler } from "@/service/notification.low-seat.handler";
import { ExpiringCheckInHandler } from "@/service/notification.expiring-checkin.handler";

export async function scheduleSendFlightNotifications(
	likedFlightRepo: LikedFlightRepository,
	notificationService: NotificationService
) {
	cron.schedule("* */12 * * *", async () => {
		const handlers = [
			new LowSeatWarningHandler(likedFlightRepo),
			new ExpiringCheckInHandler(likedFlightRepo),
		];

		for (const handler of handlers) {
			const map = (await handler.handle()) ?? [];
			for (const [userId, entries] of map.entries()) {
				for (const entry of entries) {
					await notificationService.push(entry, userId);
				}
			}
		}
	});
}
