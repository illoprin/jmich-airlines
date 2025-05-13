import { FlightStatus, type Flight } from '@/api/types/entities/flight';
import { BASE_API } from '@/store/store';

export const likedFlightMock: Flight[] = [
  {
    id: 2,
    route_code: 'K629',
    departure_city: {
      id: 18,
      name: 'Сеул',
      image: `${BASE_API}/upload/seoul.jpg`,
      airport: {
        id: 32,
        code: 'SEL',
        name: 'Инчхон',
      },
    },
    arrival_city: {
      id: 9,
      name: 'Варшава',
      image: `${BASE_API}/upload/warsaw.jpg`,
      airport: {
        id: 19,
        code: 'WAW',
        name: 'Фридерика Шопена',
      },
    },
    company: {
      id: 2,
      name: 'S7 Airlines',
      logo: `${BASE_API}/upload/s7.png`,
      baggage_rule: {
        max_free_weight: 5,
        price_per_kg: 3000,
      },
    },
    departure_date: '2025-05-09T15:43:03.655Z',
    arrival_date: '2025-05-09T20:42:18.972Z',
    price: 7029.296875,
    seats_available: 25,
    status: FlightStatus.Active,
  },
  {
    id: 18,
    route_code: 'K570',
    departure_city: {
      id: 15,
      name: 'Пекин',
      image: `${BASE_API}/upload/beijing.jpg`,
      airport: {
        id: 27,
        code: 'PEK',
        name: 'Шоуду',
      },
    },
    arrival_city: {
      id: 13,
      name: 'Анталья',
      image: `${BASE_API}/upload/antalya.jpg`,
      airport: {
        id: 23,
        code: 'AYT',
        name: 'Анталья',
      },
    },
    company: {
      id: 1,
      name: 'Аэрофлот',
      logo: `${BASE_API}/upload/aeroflot.png`,
      baggage_rule: {
        max_free_weight: 5,
        price_per_kg: 3000,
      },
    },
    departure_date: '2025-05-09T15:43:23.766Z',
    arrival_date: '2025-05-09T17:03:55.059Z',
    price: 9027.34375,
    seats_available: 146,
    status: FlightStatus.Active,
  },
  {
    id: 218,
    route_code: 'V574',
    departure_city: {
      id: 15,
      name: 'Пекин',
      image: `${BASE_API}/upload/beijing.jpg`,
      airport: {
        id: 27,
        code: 'PEK',
        name: 'Шоуду',
      },
    },
    arrival_city: {
      id: 6,
      name: 'Нью-Йорк',
      image: `${BASE_API}/upload/newyork.jpg`,
      airport: {
        id: 9,
        code: 'LGA',
        name: 'LaGuardia',
      },
    },
    company: {
      id: 2,
      name: 'S7 Airlines',
      logo: `${BASE_API}/upload/s7.png`,
      baggage_rule: {
        max_free_weight: 5,
        price_per_kg: 3000,
      },
    },
    departure_date: '2025-05-09T15:43:50.970Z',
    arrival_date: '2025-05-09T20:26:19.760Z',
    price: 6343.75,
    seats_available: 89,
    status: FlightStatus.Active,
  },
];
