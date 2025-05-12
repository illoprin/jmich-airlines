import { FlightRepository } from "@/repository/flight.repository";
import {
  InvalidFieldError,
  NotFoundError,
  RelatedDataError,
} from "../lib/service/errors";
import { LikedFlightCache } from "../redis/liked-flight.cache";
import { LikedFlightRepository } from "../repository/liked-flight.repository";
import { FlightDTO } from "../types/dto/flight";
import { FlightStatus } from "@/types/repository/flight";
import { StorageError, StorageErrorType } from "@/lib/repository/storage-error";

export class LikedFlightService {
  constructor(
    private likedFlightRepo: LikedFlightRepository,
    private likedFlightCache: LikedFlightCache,
    private flightRepo: FlightRepository,
  ) {}

  /**
   * Get all user's liked flight
   * @param userID - ID of user
   */
  public async getUserLikedFlights(userID: number): Promise<FlightDTO[]> {
    const cached = await this.likedFlightCache.get(userID);
    if (cached) return cached;

    const flights = this.likedFlightRepo.getAllByUserID(userID) ?? [];
    await this.likedFlightCache.set(userID, flights);
    return flights;
  }

  /**
   * Add flight to liked by id
   * @param userID - ID of user
   * @param flightID - ID of light
   */
  public async likeFlight(userID: number, flightID: number): Promise<void> {
    // Check is it active flight
    const flight = this.flightRepo.getByID(flightID);
    if (!flight) throw new NotFoundError("invalid flight id");
    if (flight.status != FlightStatus.ACTIVE)
      throw new InvalidFieldError("this flight is inactive");
    try {
      this.likedFlightRepo.add({ user_id: userID, flight_id: flightID });
      await this.likedFlightCache.invalidate(userID);
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.FOREIGN_KEY) {
          throw new RelatedDataError("invalid user id foreign key");
        }
      }
      throw err;
    }
  }

  public async unlikeFlight(userID: number, flightID: number): Promise<void> {
    const changes = this.likedFlightRepo.removeByUserAndFlight(
      userID,
      flightID,
    );
    if (!changes) {
      throw new NotFoundError("flight is not in user's liked list");
    }
    await this.likedFlightCache.invalidate(userID);
  }
}
