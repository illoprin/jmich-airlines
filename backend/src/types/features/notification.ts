import { NotificationEntry } from "../repository/notification";

export interface LikedFlightEventPayload {
  user_id: number;
  route_code: string;
  departure_city_name: string;
  arrival_city_name: string;
  company_logo: string;
}

export interface NotificationEventHandler {
  handle(): Map<number, NotificationEntry[]> | null;
}
