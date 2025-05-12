import type { UserEntry } from "../../types/repository/user";
import * as jwt from "jsonwebtoken";

export function createToken(candidate: UserEntry, secret: string): string {
  // NOTE: you can do jwt token logic more currect
  return jwt.sign(
    {
      id: candidate.id,
      role: candidate.role,
      login: candidate.login,
    },
    secret,
    {
      expiresIn: "24h",
    },
  );
}
