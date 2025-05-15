import {
  FlightStatus,
  type Flight,
} from '@/api/types/entities/flight';
import { BASE_API } from '@/store/store';

export const mockFlights: Flight[] = [
  {
    id: 29,
    route_code: 'O423',
    departure_city: {
      id: 13,
      name: 'Анталья',
      image: `/upload/antalya.jpg`,
      airport: {
        id: 25,
        code: 'DLM',
        name: 'Даламан',
      },
    },
    arrival_city: {
      id: 7,
      name: 'Париж',
      image: `/upload/paris.jpg`,
      airport: {
        id: 16,
        code: 'ORY',
        name: 'Париж Орли',
      },
    },
    company: {
      id: 9,
      name: 'Smartavia',
      logo: `/upload/smartavia.png`,
      baggage_rule: {
        max_free_weight: 9,
        price_per_kg: 3900,
      },
    },
    departure_date: '2025-05-10T11:43:23.767Z',
    arrival_date: '2025-05-10T13:54:08.312Z',
    price: 6896.25,
    seats_available: 55,
    status: FlightStatus.Active,
  },
  {
    id: 229,
    route_code: 'B026',
    departure_city: {
      id: 13,
      name: 'Анталья',
      image: `/upload/antalya.jpg`,
      airport: {
        id: 24,
        code: 'GZP',
        name: 'Газипаша',
      },
    },
    arrival_city: {
      id: 5,
      name: 'Горно-Алтайск',
      image: `/upload/altay.jpg`,
      airport: {
        id: 8,
        code: 'RGK',
        name: 'Горно-Алтайск',
      },
    },
    company: {
      id: 5,
      name: 'Nordwind Airlines',
      logo: `/upload/nordwind.png`,
      baggage_rule: {
        max_free_weight: 9,
        price_per_kg: 3900,
      },
    },
    departure_date: '2025-05-11T11:43:50.971Z',
    arrival_date: '2025-05-11T13:39:31.507Z',
    price: 7228.75,
    seats_available: 114,
    status: FlightStatus.Active,
  },
  {
    id: 819,
    route_code: 'Z901',
    departure_city: {
      id: 15,
      name: 'Пекин',
      image: `/upload/beijing.jpg`,
      airport: {
        id: 28,
        code: 'PKX',
        name: 'Дасин',
      },
    },
    arrival_city: {
      id: 6,
      name: 'Нью-Йорк',
      image: `/upload/newyork.jpg`,
      airport: {
        id: 9,
        code: 'LGA',
        name: 'LaGuardia',
      },
    },
    company: {
      id: 1,
      name: 'Аэрофлот',
      logo: `/upload/aeroflot.png`,
      baggage_rule: {
        max_free_weight: 5,
        price_per_kg: 3000,
      },
    },
    departure_date: '2025-05-12T11:44:13.802Z',
    arrival_date: '2025-05-12T16:37:07.828Z',
    price: 4748.75,
    seats_available: 185,
    status: FlightStatus.Active,
    cheapest: true,
  },
  {
    id: 1396,
    route_code: 'T905',
    departure_city: {
      id: 3,
      name: 'Дубай',
      image: `/upload/dubai.jpg`,
      airport: {
        id: 6,
        code: 'DWC',
        name: 'Аль Мактум',
      },
    },
    arrival_city: {
      id: 18,
      name: 'Сеул',
      image: `/upload/seoul.jpg`,
      airport: {
        id: 31,
        code: 'GMP',
        name: 'Гимпо',
      },
    },
    company: {
      id: 5,
      name: 'Nordwind Airlines',
      logo: `/upload/nordwind.png`,
      baggage_rule: {
        max_free_weight: 9,
        price_per_kg: 3900,
      },
    },
    departure_date: '2025-05-12T11:45:02.747Z',
    arrival_date: '2025-05-12T13:49:38.161Z',
    price: 8418.75,
    seats_available: 63,
    status: FlightStatus.Active,
  },
  {
    id: 5,
    route_code: 'B852',
    departure_city: {
      id: 8,
      name: 'Вашингтон',
      image: `/upload/washington.jpg`,
      airport: {
        id: 13,
        code: 'IAD',
        name: 'Даллес',
      },
    },
    arrival_city: {
      id: 3,
      name: 'Дубай',
      image: `/upload/dubai.jpg`,
      airport: {
        id: 6,
        code: 'DWC',
        name: 'Аль Мактум',
      },
    },
    company: {
      id: 3,
      name: 'Россия',
      logo: `/upload/russia.png`,
      baggage_rule: {
        max_free_weight: 5,
        price_per_kg: 3000,
      },
    },
    departure_date: '2025-05-12T15:43:03.655Z',
    arrival_date: '2025-05-12T20:21:01.108Z',
    price: 7352.5,
    seats_available: 17,
    status: FlightStatus.Active,
    cheapest: true,
  },
  {
    id: 39,
    route_code: 'U711',
    departure_city: {
      id: 4,
      name: 'Волгоград',
      image: `/upload/volgograd.jpg`,
      airport: {
        id: 7,
        code: 'VOG',
        name: 'Волгоград',
      },
    },
    arrival_city: {
      id: 6,
      name: 'Нью-Йорк',
      image: `/upload/newyork.jpg`,
      airport: {
        id: 11,
        code: 'JFK',
        name: 'John F. Kennedy',
      },
    },
    company: {
      id: 6,
      name: 'Победа',
      logo: `/upload/pobeda.png`,
      baggage_rule: {
        max_free_weight: 2,
        price_per_kg: 1200,
      },
    },
    departure_date: '2025-05-12T15:43:23.767Z',
    arrival_date: '2025-05-12T19:46:38.015Z',
    price: 7107.5,
    seats_available: 47,
    status: FlightStatus.Active,
  },
  {
    id: 239,
    route_code: 'O038',
    departure_city: {
      id: 2,
      name: 'Москва',
      image: `/upload/moskow.jpg`,
      airport: {
        id: 2,
        code: 'DME',
        name: 'Домодедово',
      },
    },
    arrival_city: {
      id: 16,
      name: 'Берлин',
      image: `/upload/berlin.jpg`,
      airport: {
        id: 29,
        code: 'BER',
        name: 'Бранденбург',
      },
    },
    company: {
      id: 6,
      name: 'Победа',
      logo: `/upload/pobeda.png`,
      baggage_rule: {
        max_free_weight: 2,
        price_per_kg: 1200,
      },
    },
    departure_date: '2025-05-12T15:43:50.971Z',
    arrival_date: '2025-05-12T19:07:23.858Z',
    price: 390,
    seats_available: 77,
    status: FlightStatus.Active,
  },
  {
    id: 829,
    route_code: 'N966',
    departure_city: {
      id: 15,
      name: 'Пекин',
      image: `/upload/beijing.jpg`,
      airport: {
        id: 28,
        code: 'PKX',
        name: 'Дасин',
      },
    },
    arrival_city: {
      id: 18,
      name: 'Сеул',
      image: `/upload/seoul.jpg`,
      airport: {
        id: 32,
        code: 'SEL',
        name: 'Инчхон',
      },
    },
    company: {
      id: 1,
      name: 'Аэрофлот',
      logo: `/upload/aeroflot.png`,
      baggage_rule: {
        max_free_weight: 5,
        price_per_kg: 3000,
      },
    },
    departure_date: '2025-05-12T15:44:13.803Z',
    arrival_date: '2025-05-12T18:38:52.787Z',
    price: 1782.5,
    seats_available: 87,
    status: FlightStatus.Active,
  },
];
