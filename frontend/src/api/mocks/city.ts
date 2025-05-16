import type { City } from "@/api/types/entities/city.ts";

export const mockCities: City[] = [
  {
    id: 1,
    name: "Москва",
    image: `/upload/moskow.jpg`,
    airports: [
      {
        id: 1,
        name: "Шереметьево",
        code: "SVO"
      },
      {
        id: 2,
        name: "Домодедово",
        code: "DME"
      },
      {
        id: 3,
        name: "Внуково",
        code: "VKO"
      },
    ]
  },
  {
    id: 2,
    name: "Самара",
    image: `/upload/city_default.jpg`,
    airports: [
      {
        id: 4,
        name: "Курумоч",
        code: "KUF"
      },
    ]
  },
  {
    id: 3,
    name: "Париж",
    image: `/upload/paris.jpg`,
    airports: [
      {
        id: 5,
        name: "Шарль-Де-Голь",
        code: "GOL"
      },
      {
        id: 6,
        name: "Париж-Орли",
        code: "ORY"
      },
    ]
  },
]