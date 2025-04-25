import type { Roles } from "./user.type";

export interface TokenData {
	id: number;
	role: Roles;
	login: string;
}