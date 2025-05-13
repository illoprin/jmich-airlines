import {
  mockPayment,
  mockToken,
  mockUser,
  mockUsers,
} from '@/api/mocks/user.ts';
import type {
  UserLoginPayload,
  UserRegistrationPayload,
} from '@/api/types/requests/user.ts';
import type { Payment } from '@/api/types/entities/payment.ts';
import type { User } from '@/api/types/entities/user.ts';
import { UserTokenError } from '@/lib/service/errors';

export class UserAPI {
  public static async getCurrentUser(token: string): Promise<User> {
    if (token) { 
      return mockUser;
    } else {
      throw new UserTokenError('Токен протух');
    }
  }

  /**
   * Login user
   * @param payload - user login data
   * @return JWT Access Token
   */
  public static async loginUser(
    payload: UserLoginPayload,
  ): Promise<string> {
    if (
      mockUsers.find(
        user => payload.login === user.login && payload.password === payload.password
      )
    ) {
      return mockToken;
    } else {
      // TODO: show message from server
      throw new Error('invalid fields');
    }
  }

  public static async registerUser(
    payload: UserRegistrationPayload,
  ): Promise<void> {
    // registered!
  }

  /**
   * Generate actual access token
   * @param token - current token
   * @return New access token
   */
  public static async verifyUser(token: string): Promise<string> {
    // always verified
    return mockToken;
  }



  public static async updateCurrentUser(
    token: string,
    payload: any,
  ): Promise<void> {
    
  }

  public static async removeUser(
    token: string
  ): Promise<void> {

  }

  public static async getUserPayments(
    token: string,
  ): Promise<Payment> {
    if (token) {
      return mockPayment;
    } else {
      // TODO: show message from server
      throw new Error('invalid token');
    }
  }

  public static async removeUserPayment(
    token: string,
    paymentID: number
  ): Promise<void> {

  }
}
