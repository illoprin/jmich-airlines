import type {
  UserLoginPayload,
  UserRegistrationPayload,
} from '@/api/types/requests/user.ts';
import type { Payment } from '@/api/types/entities/payment.ts';
import type { User } from '@/api/types/entities/user.ts';
import type { UserLevelDiscountRules } from '@/api/types/entities/discount';
import { $authHost, $host } from '@/api/httpClient';

export class UserAPI {
  public static async getCurrentUser(): Promise<User> {
    const response = await $authHost.get('user');
    const { user } = (await response.json()) as any;
    return user;
  }

  /**
   * Login user
   * @param payload - user login data
   * @return JWT Access Token
   */
  public static async loginUser(
    payload: UserLoginPayload,
  ): Promise<string> {
    const response = await $host.post('user/login', {
      json: payload,
    });
    const { token } = (await response.json()) as any;
    return token;
  }

  public static async registerUser(
    payload: UserRegistrationPayload,
  ): Promise<void> {
    await $host.post('user', {
      json: payload,
    });
  }

  /**
   * Generate actual access token
   * @param token - current token
   * @return New access token
   */
  public static async verifyUser(): Promise<string> {
    const response = await $authHost.post('user/verify');
    const { token } = (await response.json()) as any;
    return token;
  }

  public static async updateCurrentUser(payload: any): Promise<void> {
    await $authHost.put('user', {
      json: payload,
    });
  }

  public static async removeUser(): Promise<void> {
    await $authHost.delete('user');
  }

  public static async getPayments(): Promise<Payment[]> {
    const response = await $authHost.get('user/payment');
    const { payment } = (await response.json()) as any;
    return payment;
  }

  public static async removePayment(
    paymentID: number,
  ): Promise<void> {
    await $authHost.delete(`user/payment/${paymentID}`);
  }
  
  public static async addPayment(payment: Payment) {
    await $authHost.post(`user/payment`, {
      json: payment
    });
  }

  public static async getRules(): Promise<UserLevelDiscountRules> {
    const response = await $authHost.get('user/rules');
    const { rule } = (await response.json()) as any;
    return rule;
  }
}
