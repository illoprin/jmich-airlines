import { NotificationEntry } from "@/types/repository/notification";
import { NotificationEventHandler, LikedFlightEventPayload } from "@/types/features/notification";
import { LikedFlightRepository } from "@/repository/liked-flight.repository";

export class ExpiringCheckInHandler implements NotificationEventHandler {
	constructor(private readonly likedFlightRepo: LikedFlightRepository) {}

	public handle(): Map<number, NotificationEntry[]> | null {
		const events = this.likedFlightRepo.getFlightsWithExpiringRegistration();
		return !events ? null : this.groupNotifications(events, (e) => ({
			title: `Срок регистрации истекает`,
			body: `Спешите, истекает срок регистрации на рейс ${e.route_code} (${e.departure_city_name} → ${e.arrival_city_name})!`,
			image: e.company_logo,
		}));
	}

	private groupNotifications(
		events: LikedFlightEventPayload[],
		builder: (e: LikedFlightEventPayload) => Omit<NotificationEntry, "id">
	): Map<number, NotificationEntry[]> {
		const map = new Map<number, NotificationEntry[]>();
		for (const e of events) {
			const notification = { id: Date.now(), ...builder(e) };
			const arr = map.get(e.user_id) ?? [];
			arr.push(notification);
			map.set(e.user_id, arr);
		}
		return map;
	}
}
