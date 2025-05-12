import { mockPayment, mockUser } from "@/api/mocks/user.ts";
import type { UserLoginPayload } from "@/api/types/requests/user.ts";
import { UserLoginError, UserTokenError } from "@/lib/api/errors.ts";
import type { Payment } from "@/api/types/entities/payment.ts";
import type { User } from "@/api/types/entities/user.ts";

export class UserAPI {
  public static async getCurrentUser(token: string): Promise<User | null> {
    if (token) {
      return mockUser;
    } else {
      return null;
    }
  }

  /**
   * Login user
   * @param payload - user login data
   * @return JWT Access Token
   */
  public static async loginUser(payload: UserLoginPayload): Promise<string> {
    if (payload.login && payload.password) {
      return "abc123";
    } else {
      throw new UserLoginError("invalid fields");
    }
  }

  public static async getUserPayments(token: string): Promise<Payment> {
    if (token) {
      return mockPayment;
    } else {
      throw new UserTokenError("invalid token");
    }
  }
}