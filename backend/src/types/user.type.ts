import type { Entry } from "../lib/repository/base.repository";

export enum Roles {
	Customer = 1,
	Moderator = 2,
	Admin = 3,
}

export interface UserRegDTO {
	login: string;
	firstname: string;
	secondname: string;
	phone: string;
	email: string;
	password: string;
}

export interface UserPublicDTO extends Entry {
	firstname: string;
	secondname: string;
	email: string;
	avatarpath: string;
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