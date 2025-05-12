import cron from "node-cron";
import { FlightService } from "../service/flight.service";

export function scheduleIncreasePrice(flightService: FlightService): void {
  cron.schedule("0 */12 * * *", () => {
    try {
      const amount: number = 0.25;
      const hoursBefore: number = 12;
      const count = flightService.increasePrice(hoursBefore, amount);
      console.log(`price increased for ${count} active flights`);
    } catch (err) {
      console.error("failed to increase flights price", (err as Error).message);
    }
  });
}
