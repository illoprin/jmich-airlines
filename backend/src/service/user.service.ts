import bcrypt from "bcrypt";
import { UserRepository } from "../repository/user.repository";
import {
	Roles,
	type UserPublicDTO,
	type UserEntry,
	type UserRegDTO,
} from "../types/user.type";
import type { Config } from "../types/config.type";
import { createToken } from "../lib/api/token";
import type { PaymentRepository } from "../repository/payment.repository";
import type { PaymentEntry } from "../types/payment.type";
import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import {
	ForbiddenError,
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
} from "../types/service.type";
import { AccessControl } from "../lib/service/access-control";

export class UserService {
	constructor(
		private userRepo: UserRepository,
		private paymentRepo: PaymentRepository,
		private cfg: Config
	) {}

	public register(user: UserRegDTO): bigint {
		const password_hash = bcrypt.hashSync(user.password, this.cfg.salt);
		user.password = password_hash;
		const entry: UserEntry = {
			...user,
			role: Roles.Customer,
		};
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
	public login(entry: { login: string; password: string }): string {
		const candidate = this.userRepo.getByLogin(entry.login);

		if (!candidate) {
			throw new NotFoundError(`user with login ${entry.login} not found`);
		}

		const compareResult = bcrypt.compareSync(
			entry.password,
			candidate.password
		);

		if (!compareResult) {
			throw new ForbiddenError(`incorrect password`);
		}

		const token = createToken(candidate, this.cfg.secret);

		return token;
	}

	public getByID(id: number): UserEntry {
		const user = this.userRepo.getByID(id);
		if (!user) {
			throw new NotFoundError("user not found");
		}
		return user;
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

	public update(id: number, newFields: any, roleChangingAllowed: boolean) {
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

		let updated: UserEntry = {
			id: candidate.id,
			login: newFields.login ?? candidate.login,
			firstname: newFields.firstname ?? candidate.firstname,
			secondname: newFields.secondname ?? candidate.secondname,
			email: newFields.email ?? candidate.email,
			phone: newFields.phone ?? candidate.phone,
			avatarpath: newFields.avatarpath ?? candidate.avatarpath,
			password: password_hash ?? candidate.password,
			role: roleChangingAllowed ? newFields.role : candidate.role,
		};

		try {
			this.userRepo.update(updated);
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

	public delete(id: number): void {
		const changes = this.userRepo.removeByID(id);
		if (!changes) {
			throw new NotFoundError("user not found");
		}
	}

	public addPayment(entry: PaymentEntry) {
		try {
			// WARN: one user can use similar cards
			const inserted_id = this.paymentRepo.add(entry);
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError(`invalid field '${err.field}'`);
				}
			} else {
				throw err;
			}
		}
	}

	public getPaymentByID(userID: number, userRole: Roles, id: number): PaymentEntry {
		return AccessControl.checkAccess<PaymentEntry>(
			userID, userRole,
			Roles.Admin, id,
			(id) => this.paymentRepo.getByID(id)
		);
	}

	public deletePayment(userID: number, userRole: Roles, id: number): void {
		// Check access to data
		AccessControl.checkAccess<PaymentEntry>(
			userID, userRole,
			Roles.Admin, id,
			(id) => this.paymentRepo.getByID(id)
		);
		
		this.paymentRepo.removeByID(id);
	}

	public getPaymentsByUserID(user_id: number): PaymentEntry[] {
		const payments = this.paymentRepo.getByUserID(user_id);
		return payments ?? [];
	}
}
