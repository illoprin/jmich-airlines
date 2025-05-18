import bcrypt from "bcrypt";
import { UserRepository } from "@/repository/user.repository";
import { type UserEntry, UserLevel, Roles } from "@/types/repository/user";
import type { UserPublicDTO } from "@/types/dto/user";
import { UserRegistrationPayload } from "@/types/handler/user";
import type { Config } from "@/types/internal/config";
import { createToken } from "@/lib/api/token";
import type { PaymentRepository } from "@/repository/payment.repository";
import type { PaymentEntry } from "@/types/repository/payment";
import {
  StorageError,
  StorageErrorType,
} from "@/lib/repository/storage-error";
import {
  ForbiddenError,
  InvalidFieldError,
  NotFoundError,
  NotUniqueError,
} from "@/lib/service/errors";
import { AccessControl } from "@/lib/service/access-control";
import { UserCache } from "@/redis/user.cache";
import type { TokenData } from "@/types/features/token";

export class UserService {
  constructor(
    private userRepo: UserRepository,
    private userCache: UserCache,
    private paymentRepo: PaymentRepository,
    private cfg: Config,
  ) {}

  public register(user: UserRegistrationPayload): bigint {
    const password_hash = bcrypt.hashSync(user.password, this.cfg.salt);
    user.password = password_hash;
    const entry: UserEntry = {
      ...user,
      level: UserLevel.Basic,
      role: Roles.Customer,
      avatarpath: '/upload/protected/avatar_default.jpg'
    };
    // NOTE: send email and wait for confirmation
    try {
      const res = this.userRepo.add(entry);
      return res;
    } catch (_err) {
      const err = _err as Error;
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError(`user with same '${err.field}' exists`);
        } else if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(`invalid field '${err.field}'`);
        }
      }
      throw _err;
    }
  }

  /**
   * @param entry user login & password
   * @returns jwt access token
   */
  public async login(entry: {
    login: string;
    password: string;
  }): Promise<string> {
    const candidate = this.userRepo.getByLogin(entry.login);

    if (!candidate) {
      throw new NotFoundError(`user with login ${entry.login} not found`);
    }

    const compareResult = bcrypt.compareSync(
      entry.password,
      candidate.password,
    );

    if (!compareResult) {
      throw new ForbiddenError(`incorrect password`);
    }

    const token = createToken(candidate, this.cfg.secret);
    await this.userCache.set(candidate.id as number, candidate);

    return token;
  }

  public async verify(tokenData: TokenData): Promise<string> {
    const { id } = tokenData;
    let user: UserEntry | null = null;
    user = await this.userCache.get(id);
    if (!user) {
      user = this.userRepo.getByID(id);
      if (!user) {
        throw new NotFoundError('user not found');
      }
      await this.userCache.set(id, user);
    }
    return createToken(user, this.cfg.secret);
  }

  public async getByID(id: number): Promise<UserEntry> {
    const userCached = await this.userCache.get(id);
    if (!userCached) {
      const user = this.userRepo.getByID(id);
      if (!user) {
        throw new NotFoundError("user not found");
      }
      await this.userCache.set(id, user);
      return user;
    }
    return userCached;
  }

  public getPublicDataByID(id: number): UserPublicDTO {
    const user = this.userRepo.getPublicDataByID(id);
    if (!user) {
      throw new NotFoundError("user not found");
    }
    return user;
  }

  public getAll(): UserEntry[] {
    const users = this.userRepo.getAll();
    if (!users) {
      throw new NotFoundError("user not found");
    }
    return users;
  }

  /**
   * Update user data
   * @param id - User ID
   * @param newFields - user entry fields with new value
   * @param roleChangingAllowed - is role changing allowed operation
   * @returns new access token if key field (role, login) has been changed
   */
  public async update(
    id: number,
    newFields: any,
    roleChangingAllowed: boolean,
  ): Promise<string | undefined> {
    const candidate = this.userRepo.getByID(id);
    if (!candidate) {
      throw new NotFoundError("user not found");
    }
    const password_hash = newFields.password
      ? bcrypt.hashSync(newFields.password, this.cfg.salt)
      : null;

    if (newFields.role && !roleChangingAllowed) {
      throw new ForbiddenError("role changing is not allowed");
    }

    if (newFields.level) {
      throw new ForbiddenError("you cannot change level manually");
    }

    let updated: UserEntry = {
      id: candidate.id,
      login: newFields.login ?? candidate.login,
      firstname: newFields.firstname ?? candidate.firstname,
      secondname: newFields.secondname ?? candidate.secondname,
      email: newFields.email ?? candidate.email,
      phone: newFields.phone ?? candidate.phone,
      avatarpath: newFields.avatarpath ?? candidate.avatarpath,
      password: password_hash ?? candidate.password,
      level: candidate.level,
      role: roleChangingAllowed ? newFields.role : candidate.role,
    };

    try {
      this.userRepo.update(updated);
      // WARN: return new access token after changing a role or login is bad practice in my opinion
      await this.userCache.invalidate(id);
      return newFields.role || newFields.login
        ? createToken(updated, this.cfg.secret)
        : undefined;
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError(`user with same ${err.field} exists`);
        } else if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(`invalid field ${err.field}`);
        }
      } else {
        throw err;
      }
    }
  }

  public async delete(id: number) {
    const changes = this.userRepo.removeByID(id);
    if (!changes) {
      throw new NotFoundError("user not found");
    }
    await this.userCache.invalidate(id);
  }

  public addPayment(entry: PaymentEntry) {
    try {
      // WARN: one user can use similar cards
      this.paymentRepo.add(entry);
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(`invalid field '${err.field}'`);
        } else if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError("this user already has this card");
        }
      } else {
        throw err;
      }
    }
  }

  public getPaymentByID(
    userID: number,
    userRole: Roles,
    id: number,
  ): PaymentEntry {
    return AccessControl.checkAccess<PaymentEntry>(
      userID,
      userRole,
      Roles.Admin + 1, // HACK: prevent payments access to admin
      id,
      (id) => this.paymentRepo.getByID(id),
    );
  }

  public deletePayment(userID: number, userRole: Roles, id: number): void {
    // Check access to data
    AccessControl.checkAccess<PaymentEntry>(
      userID,
      userRole,
      Roles.Admin + 1, // HACK: prevent payments access to admin
      id,
      (id) => this.paymentRepo.getByID(id),
    );

    this.paymentRepo.removeByID(id);
  }

  public getPaymentsByUserID(user_id: number): PaymentEntry[] {
    const payments = this.paymentRepo.getByUserID(user_id);
    return payments ?? [];
  }
}
