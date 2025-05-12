import type { UserRole } from "@/service/api/types/entities/user.ts";

export interface TokenData {
  id: number; // ID of user
  role: UserRole; // user role
  login: string; // user login
}