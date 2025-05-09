import { NotFoundError } from "../lib/service/errors";
import { LikedFlightCache } from "../redis/liked-flight.cache";
import { LikedFlightRepository } from "../repository/liked-flight.repository";
import { FlightDTO } from "../types/dto/flight";

export class LikedFlightService {
	constructor(
		private likedFlightRepo: LikedFlightRepository,
		private likedFlightCache: LikedFlightCache
	) {}

	public async getUserLikedFlights(userID: number): Promise<FlightDTO[]> {
		const cached = await this.likedFlightCache.get(userID);
		if (cached) return cached;

		const flights = this.likedFlightRepo.getAllByUserID(userID) ?? [];
		await this.likedFlightCache.set(userID, flights);
		return flights;
	}

	public async likeFlight(userID: number, flightID: number): Promise<void> {
		this.likedFlightRepo.add({ user_id: userID, flight_id: flightID });
		await this.likedFlightCache.invalidate(userID);
	}

	public async unlikeFlight(userID: number, flightID: number): Promise<void> {
		const changes = this.likedFlightRepo.removeByUserAndFlight(
			userID,
			flightID
		);
		if (!changes) {
			throw new NotFoundError("Flight is not in user's liked list");
		}
		await this.likedFlightCache.invalidate(userID);
	}
}
