import { NotificationEntry } from "@/types/repository/notification";
import { LikedFlightRepository } from "@/repository/liked-flight.repository";
import {
  NotificationEventHandler,
  LikedFlightEventPayload,
} from "@/types/features/notification";

export class LowSeatWarningHandler implements NotificationEventHandler {
  constructor(private likedFlightRepo: LikedFlightRepository) {}

  public handle(): Map<number, NotificationEntry[]> | null {
    const events = this.likedFlightRepo.getFlightsWithLowSeats();
    return !events
      ? null
      : this.buildMap(events, (e) => ({
          title: `Осталось менее 15 билетов`,
          body: `Осталось менее 15 билетов на рейс ${e.route_code} (${e.departure_city_name} → ${e.arrival_city_name})`,
          image: e.company_logo,
        }));
  }

  private buildMap(
    events: LikedFlightEventPayload[],
    builder: (e: LikedFlightEventPayload) => Omit<NotificationEntry, "id">,
  ): Map<number, NotificationEntry[]> {
    const result = new Map<number, NotificationEntry[]>();
    for (const e of events) {
      const entry = { id: Date.now(), ...builder(e) };
      const list = result.get(e.user_id) ?? [];
      list.push(entry);
      result.set(e.user_id, list);
    }
    return result;
  }
}
