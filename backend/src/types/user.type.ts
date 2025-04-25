import type { Entry } from "./repository.type";

export enum Roles {
	Customer = 1,
	Moderator = 2,
	Admin = 3,
}

export interface UserEntry extends Entry {
	login: string;
	firstname: string;
	secondname: string;
	phone: string;
	email: string;
	password: string;

	avatarpath?: string;
	role?: Roles;
}

export interface UserEntryPublic extends Entry {
	firstname: string;
	secondname: string;
	email: string;
	avatarpath: string;
}
