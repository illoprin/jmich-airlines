
export enum Roles {
	Customer = 0,
	Moderator = 1,
	Admin = 2,
}

export interface UserEntry {
	id : number;
	login : string;
	firstname : string;
	secondname : string;
	phone : string;
	email : string;
	password_hash : string;
	avatarpath : string;
	role : Roles;
}