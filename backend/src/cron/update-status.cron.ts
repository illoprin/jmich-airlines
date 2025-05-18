import cron from "node-cron";
import { FlightService } from "@/service/flight.service";
import { BookingService } from "@/service/booking.service";
import type { LikedFlightService } from "@/service/liked-flight.service";

export function scheduleUpdateStatus(
  flightService: FlightService,
  bookingService: BookingService,
  likedFlightService: LikedFlightService
) {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const completedFlights = flightService.completeExpired();
      const completedBookings = bookingService.completeExpired();
      const deletedLikedFlights = await likedFlightService.dislikeExpiredFlights();
      console.log(
        `update status job:` +
          `\n\tcompleted flights: ${completedFlights}` +
          `\n\tcompleted bookings: ${completedBookings}` +
          `\n\tdeleted liked flights: ${deletedLikedFlights}`,
      );
    } catch (err) {
      console.error(`failed status update ${(err as Error).message}`);
    }
  });
}
