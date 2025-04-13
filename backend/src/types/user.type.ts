
export enum Roles {
	Customer = "CUSTOMER",
	Moderator = "MODERATOR",
	Admin = "ADMIN",
}

export interface UserEntry {
	id?: number;
	login: string;
	firstname: string;
	secondname: string;
	phone: string;
	email: string;
	password_hash: string;
	avatarpath: string;
	role: Roles;
}

export interface UserEntryPublic {
	id?: number;
	firstname: string;
	secondname:	string;
	email: string;
	avatarpath: string;
}