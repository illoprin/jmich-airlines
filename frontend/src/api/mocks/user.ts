import {
  type User,
  UserLevel,
  UserRole
} from "@/api/types/entities/user.ts";
import { BASE_API } from "@/store/store.ts";
import type { Payment } from "@/api/types/entities/payment.ts";

export const mockUser: User = {
  id: 1,
  login: "illoprin",
  role: UserRole.Customer,
  avatarpath: `${BASE_API}/upload/protected/avatar_default.jpg`,
  email: "illoprin@gmail.com",
  firstname: "Шалтай",
  secondname: "Кунцевич",
  level: UserLevel.Basic,
  password: "root"
}

export const mockPayment: Payment = {
  number: "1234567890123456",
  expires: "0931",
  cvv: "363",
}