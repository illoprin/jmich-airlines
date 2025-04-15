import bcrypt from "bcrypt";
import { UserRepository } from "../repository/user.repository";
import type { UserEntry } from "../types/user.type";
import type { Config } from "../types/config.type";
import { createToken } from "../lib/api/token";
import { PaymentRepository } from "../repository/payment.repository";
import type { PaymentEntry } from "../types/payment.type";

export class UserService {
	constructor(
		private userRepo: UserRepository,
		private paymentRepo: PaymentRepository,
		private cfg: Config
	) {}

	public register(user: UserEntry): bigint {
		const password_hash = bcrypt.hashSync(user.password, this.cfg.salt);
		user.password = password_hash;
		const res = this.userRepo.add(user);
		return res;
	}

	public login(entry: { login: string; password: string }): {
		token?: string;
		message?: string;
	} {
		const candidate = this.userRepo.getByLogin(entry.login);
		if (!candidate) {
			return {
				message: `user with login '${entry.login}' is not exist`,
			};
		}

		const compareResult = bcrypt.compareSync(
			entry.password,
			candidate.password
		);
		if (!compareResult) {
			return {
				message: "incorrect password",
			};
		}

		const token = createToken(candidate, this.cfg.secret);

		return {
			token,
		};
	}

	public getByID(id: number): UserEntry | null {
		return this.userRepo.getByID(id);
	}

	public getAll(): UserEntry[] | null {
		return this.userRepo.getAll();
	}

	public update(
		id: number,
		newFields: any,
		roleChangingAllowed: boolean
	): number {
		const candidate = this.userRepo.getByID(id);
		if (candidate) {
			const password_hash = newFields.password
				? bcrypt.hashSync(newFields.password, this.cfg.salt)
				: null;

			// WARN: hardcoded fields
			let updated: UserEntry = {
				id: candidate.id,
				login: candidate.login || newFields.login,
				firstname: candidate.firstname || newFields.firstname,
				secondname: candidate.secondname || newFields.secondname,
				email: candidate.email || newFields.email,
				phone: candidate.phone || newFields.phone,
				avatarpath: candidate.avatarpath || newFields.avatarpath,
				password: password_hash || candidate.password,
				role: roleChangingAllowed ? newFields.role : candidate.role,
			};

			return this.userRepo.update(updated);
		}
		return 0;
	}
	public delete(id: number): number {
		return this.userRepo.removeByID(id);
	}

	public addPayment(entry: PaymentEntry): bigint {
		return this.paymentRepo.add(entry);
	}
	public removePayment(id: number): number {
		return this.paymentRepo.removeByID(id);
	}
	public getPaymentByUserID(user_id: number): PaymentEntry[] | null {
		return this.paymentRepo.getByUserID(user_id);
	}
	public getPaymentByID(id: number): PaymentEntry | null {
		return this.paymentRepo.getByID(id);
	}
}
