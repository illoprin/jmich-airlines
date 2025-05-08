import { Entry } from '../../lib/repository/base.repository'

export enum Roles {
	Customer = 1,
	Moderator = 2,
	Admin = 3,
}

export enum UserLevel {
	Basic = "Basic",
	Silver = "Silver",
	Gold = "Gold",
	Premium = "Premium",
	Platinum = "Platinum"
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
	level: UserLevel;
}