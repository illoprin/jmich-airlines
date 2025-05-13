import {
  type User,
  UserLevel,
  UserRole
} from "@/api/types/entities/user.ts";
import type { Payment } from "@/api/types/entities/payment.ts";


export const mockUsers: User[] = [
  {
    id: 1,
    login: "illoprin",
    avatarpath: `/upload/protected/8383fb98-d36b-418e-b549-d2f5832ee414.jpg`,
    email: "illoprin@gmail.com",
    firstname: "Шалтай",
    secondname: "Кунцевич",
    role: UserRole.Customer,
    level: UserLevel.Premium,
    password: "root"
  },
  {
    id: 1,
    login: "jmich-valery",
    avatarpath: `/upload/protected/3922d8b5-c369-45fb-a2d9-5caa5a517c60.jpg`,
    email: "jmichairlinesbusiness@yandex.com",
    firstname: "Валерий",
    secondname: "Жмышенко",
    role: UserRole.Admin,
    level: UserLevel.Platinum,
    password: "1234"
  },
  {
    id: 1,
    login: "ikulakov",
    avatarpath: `/upload/protected/defo.jpg`,
    email: "ikulakov@mail.com",
    firstname: "Иван",
    secondname: "Кулаков",
    role: UserRole.Admin,
    level: UserLevel.Platinum,
    password: "kulak"
  }

]

export const mockUser: User = {
  id: 1,
  login: "illoprin",
  avatarpath: `/upload/protected/avatar_default.jpg`,
  email: "illoprin@gmail.com",
  firstname: "Шалтай",
  secondname: "Кунцевич",
  role: UserRole.Customer,
  level: UserLevel.Basic,
  password: "root"
}

export const mockPayment: Payment = {
  number: "1234567890123456",
  expires: "0931",
  cvv: "363",
}

export const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6MSwibG9naW4iOiJpbGxvcHJpbiIsImlhdCI6MTc0NzA3MjcwMiwiZXhwIjoxNzQ5NjY0NzAyfQ.H3_MuYJqYU7Fa5bXIkYEN239qCeHLxGUUiTMOB4ckVk";