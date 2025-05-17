import {
  BookingStatus,
  type Booking,
  type TrendingFlight,
} from '@/api/types/entities/booking.ts';
import { FlightStatus } from '@/api/types/entities/flight';

const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
const HOUR_MILLISECONDS = 1000 * 60 * 60;

export const mockUserBookings: Booking[] = [
  {
    id: 5,
    user_id: 2,
    baggage_weight: 3,
    qr_code:
      'http://localhost:8000/upload/protected/8ea8e830-dd64-4a0b-a80f-a1397db98efc.png',
    created: '2025-05-10T09:48:00.733Z',
    seats: 2,
    cost: 3400,
    status: BookingStatus.Active,
    flight: {
      id: 1383,
      route_code: 'V595',
      departure_city: {
        id: 13,
        name: 'Анталья',
        image: '/upload/antalya.jpg',
        airport: {
          id: 23,
          code: 'AYT',
          name: 'Анталья',
        },
      },
      arrival_city: {
        id: 17,
        name: 'Донецк',
        image: '/upload/donetsk.jpeg',
        airport: {
          id: 30,
          code: 'DOK',
          name: 'Сергея Прокофьева',
        },
      },
      company: {
        id: 6,
        name: 'Победа',
        logo: '/upload/pobeda.png',
        baggage_rule: {
          max_free_weight: 2,
          price_per_kg: 1200,
        },
      },
      departure_date: '2025-05-10T11:45:02.746Z',
      arrival_date: '2025-05-10T15:42:00.460Z',
      price: 8827,
      seats_available: 147,
      status: FlightStatus.Delayed,
    },
  },
  {
    id: 6,
    user_id: 2,
    baggage_weight: 3,
    qr_code:
      'http://localhost:8000/upload/protected/ba1fd493-4915-46e7-952c-696af9aca86c.png',
    created: '2025-05-10T09:48:17.027Z',
    seats: 10,
    cost: 6719,
    status: BookingStatus.Active,
    flight: {
      id: 1383,
      route_code: 'V595',
      departure_city: {
        id: 13,
        name: 'Анталья',
        image: '/upload/antalya.jpg',
        airport: {
          id: 23,
          code: 'AYT',
          name: 'Анталья',
        },
      },
      arrival_city: {
        id: 17,
        name: 'Донецк',
        image: '/upload/donetsk.jpeg',
        airport: {
          id: 30,
          code: 'DOK',
          name: 'Сергея Прокофьева',
        },
      },
      company: {
        id: 6,
        name: 'Nordwind',
        logo: '/upload/nordwind.png',
        baggage_rule: {
          max_free_weight: 2,
          price_per_kg: 1200,
        },
      },
      departure_date: '2025-05-10T11:45:02.746Z',
      arrival_date: '2025-05-10T15:42:00.460Z',
      price: 8827,
      seats_available: 147,
      status: FlightStatus.Active,
    },
  },
  {
    id: 7,
    user_id: 2,
    baggage_weight: 3,
    qr_code:
      'http://localhost:8000/upload/protected/528131a5-e19e-41a9-8a73-d16e939046d1.png',
    created: '2025-05-10T09:48:23.823Z',
    seats: 4,
    cost: 6719,
    status: BookingStatus.Completed,
    flight: {
      id: 1383,
      route_code: 'V595',
      departure_city: {
        id: 13,
        name: 'Анталья',
        image: '/upload/antalya.jpg',
        airport: {
          id: 23,
          code: 'AYT',
          name: 'Анталья',
        },
      },
      arrival_city: {
        id: 17,
        name: 'Донецк',
        image: '/upload/donetsk.jpeg',
        airport: {
          id: 30,
          code: 'DOK',
          name: 'Сергея Прокофьева',
        },
      },
      company: {
        id: 6,
        name: 'Победа',
        logo: '/upload/pobeda.png',
        baggage_rule: {
          max_free_weight: 2,
          price_per_kg: 1200,
        },
      },
      departure_date: '2025-05-10T11:45:02.746Z',
      arrival_date: '2025-05-10T15:42:00.460Z',
      price: 8827,
      seats_available: 147,
      status: FlightStatus.Active,
    },
  },
  {
    id: 6,
    user_id: 2,
    baggage_weight: 3,
    qr_code:
      'http://localhost:8000/upload/protected/ba1fd493-4915-46e7-952c-696af9aca86c.png',
    created: '2025-05-10T09:48:17.027Z',
    seats: 10,
    cost: 6719,
    status: BookingStatus.Active,
    flight: {
      id: 1383,
      route_code: 'V595',
      departure_city: {
        id: 13,
        name: 'Анталья',
        image: '/upload/antalya.jpg',
        airport: {
          id: 23,
          code: 'AYT',
          name: 'Анталья',
        },
      },
      arrival_city: {
        id: 17,
        name: 'Донецк',
        image: '/upload/donetsk.jpeg',
        airport: {
          id: 30,
          code: 'DOK',
          name: 'Сергея Прокофьева',
        },
      },
      company: {
        id: 6,
        name: 'Nordwind',
        logo: '/upload/nordwind.png',
        baggage_rule: {
          max_free_weight: 2,
          price_per_kg: 1200,
        },
      },
      departure_date: '2025-05-10T11:45:02.746Z',
      arrival_date: '2025-05-10T15:42:00.460Z',
      price: 8827,
      seats_available: 147,
      status: FlightStatus.Canceled,
    },
  },
];

export const mockTrendingFlights: TrendingFlight[] = [
  {
    flight_id: 1,
    popularity: 10,
    price: 5_234,
    arrival_airport_code: 'DXB',
    arrival_city_name: 'Дубай',
    arrival_city_image: `/upload/dubai.jpg`,
    departure_airport_code: 'KUF',
    departure_city_image: `/upload/city_default.jpg`,
    departure_city_name: 'Самара',
    departure_date: new Date(
      Date.now() + DAY_MILLISECONDS * 2,
    ).toISOString(),
    arrival_date: new Date(
      Date.now() + DAY_MILLISECONDS * 2 + HOUR_MILLISECONDS * 5.3,
    ).toISOString(),
  },
  {
    flight_id: 2,
    popularity: 8,
    price: 5_234,
    arrival_airport_code: 'SVO',
    arrival_city_name: 'Москва',
    arrival_city_image: `/upload/moskow.jpg`,
    departure_airport_code: 'VOG',
    departure_city_image: `/upload/volgograd.jpg`,
    departure_city_name: 'Волгоград',
    departure_date: new Date(
      Date.now() + DAY_MILLISECONDS * 2,
    ).toISOString(),
    arrival_date: new Date(
      Date.now() + DAY_MILLISECONDS * 2 + HOUR_MILLISECONDS * 5.3,
    ).toISOString(),
  },
  {
    flight_id: 10,
    popularity: 5,
    price: 5_234,
    arrival_airport_code: 'ORY',
    arrival_city_name: 'Париж',
    arrival_city_image: `/upload/paris.jpg`,
    departure_airport_code: 'WAW',
    departure_city_image: `/upload/warsaw.jpg`,
    departure_city_name: 'Варшава',
    departure_date: new Date(
      Date.now() + DAY_MILLISECONDS * 2,
    ).toISOString(),
    arrival_date: new Date(
      Date.now() + DAY_MILLISECONDS * 2 + HOUR_MILLISECONDS * 5.3,
    ).toISOString(),
  },
];
