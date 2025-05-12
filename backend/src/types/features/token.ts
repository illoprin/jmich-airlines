import { Roles } from "../repository/user";

export interface TokenData {
  id: number;
  role: Roles;
  login: string;
}
