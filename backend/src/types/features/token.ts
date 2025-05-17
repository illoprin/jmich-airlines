import { Roles } from "@/types/repository/user";

export interface TokenData {
  id: number;
  role: Roles;
  login: string;
}
