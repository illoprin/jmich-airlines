import type { City } from "@/api/types/entities/city.ts";
import { BASE_API } from "@/store/store";


export const mockCities: City[] = [
  {
    id: 0,
    name: "Москва",
    image: `${BASE_API}/upload/moskow.jpg`,
    airports: [
      {
        id: 0,
        name: "Шереметьево",
        code: "SVO"
      },
      {
        id: 1,
        name: "Домодедово",
        code: "DME"
      },
      {
        id: 2,
        name: "Внуково",
        code: "VKO"
      },
    ]
  },
  {
    id: 1,
    name: "Самара",
    image: `${BASE_API}/upload/city_default.jpg`,
    airports: [
      {
        id: 3,
        name: "Курумоч",
        code: "KUF"
      },
    ]
  },
  {
    id: 2,
    name: "Париж",
    image: `${BASE_API}/upload/paris.jpg`,
    airports: [
      {
        id: 4,
        name: "Шарль-Де-Голь",
        code: "GOL"
      },
      {
        id: 5,
        name: "Париж-Орли",
        code: "ORY"
      },
    ]
  },
]