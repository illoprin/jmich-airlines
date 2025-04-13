import type { UserEntry } from "../types/user.type";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserEntry> {
	public getTableName(): string {
		return "user";	
	}


}