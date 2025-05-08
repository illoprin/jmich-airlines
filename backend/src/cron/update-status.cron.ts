import cron from "node-cron";
import { FlightService } from "../service/flight.service";
import { BookingService } from "../service/booking.service";

export function scheduleUpdateStatus(
	flightService: FlightService,
	bookingService: BookingService
) {
	cron.schedule("0 * * * *", () => {
		try {
			const completedFlights = flightService.completeExpired();
			const completedBookings = bookingService.completeExpired();
			console.log(
				`update status job:` +
					`\n\tcompleted flights: ${completedFlights}` +
					`\n\tcompleted bookings: ${completedBookings}`
			);
		} catch (err) {
			console.error(`failed status update ${(err as Error).message}`);
		}
	});
}
