import type { UserRole } from "@/api/types/entities/user";

export interface TokenData {
  id: number; // ID of user
  role: UserRole; // user role
  login: string; // user login
}