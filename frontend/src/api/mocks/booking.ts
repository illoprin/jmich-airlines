import type {
  Booking,
  TrendingBooking
} from "@/api/types/entities/booking.ts";
import { BASE_API } from "@/store/store.ts";

const DAY_MILLISECONDS  = 1000 * 60 * 60 * 24;
const HOUR_MILLISECONDS = 1000 * 60 * 60;

export const userBookings: Booking[] = [

];

export const trendingBookings: TrendingBooking[] = [
  {
    flight_id             : 1,
    popularity            : 10,
    price                 : 5_234,
    arrival_airport_code  : "DXB",
    arrival_city_name     : "Дубай",
    arrival_city_image    : `${BASE_API}/upload/dubai.jpg`,
    departure_airport_code: "KUF",
    departure_city_image  : `${BASE_API}/upload/city_default.jpg`,
    departure_city_name   : "Самара",
    departure_date        : new Date(Date.now() + DAY_MILLISECONDS * 2),
    arrival_date          : new Date(Date.now() + DAY_MILLISECONDS * 2 + HOUR_MILLISECONDS * 5.3),
  },
  {
    flight_id             : 2,
    popularity            : 8,
    price                 : 5_234,
    arrival_airport_code  : "SVO",
    arrival_city_name     : "Москва",
    arrival_city_image    : `${BASE_API}/upload/moskow.jpg`,
    departure_airport_code: "VOG",
    departure_city_image  : `${BASE_API}/upload/volgograd.jpg`,
    departure_city_name   : "Волгоград",
    departure_date        : new Date(Date.now() + DAY_MILLISECONDS * 2),
    arrival_date          : new Date(Date.now() + DAY_MILLISECONDS * 2 + HOUR_MILLISECONDS * 5.3),
  },
  {
    flight_id             : 10,
    popularity            : 5,
    price                 : 5_234,
    arrival_airport_code  : "ORY",
    arrival_city_name     : "Париж",
    arrival_city_image    : `${BASE_API}/upload/paris.jpg`,
    departure_airport_code: "WAW",
    departure_city_image  : `${BASE_API}/upload/warsaw.jpg`,
    departure_city_name   : "Варшава",
    departure_date        : new Date(Date.now() + DAY_MILLISECONDS * 2),
    arrival_date          : new Date(Date.now() + DAY_MILLISECONDS * 2 + HOUR_MILLISECONDS * 5.3),
  }
];