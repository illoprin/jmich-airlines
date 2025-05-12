import { Entry } from "../../lib/repository/base.repository";

export interface LikedFlightEntry extends Entry {
  flight_id: number;
  user_id: number;
}
