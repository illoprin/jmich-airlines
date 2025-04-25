import type { UserEntry, UserEntryPublic } from "../types/user.type";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserEntry> {
	public getTableName(): string {
		return "user";
	}
	public create() {
		// Create table
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				login TEXT NOT NULL UNIQUE,
				firstname TEXT NOT NULL,
				secondname TEXT NOT NULL,
				phone TEXT NOT NULL CHECK(length(phone) == 10),
				email TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				avatarpath TEXT DEFAULT '/upload/protected/avatar_default.jpg',
				role INTEGER DEFAULT 1
			);
		`,
			[]
		);
		// Create index
		this.storage.run(
			`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_${this.getTableName()} ON ${this.getTableName()}(login)
		`,
			[]
		);
	}
	public add({
		login,
		firstname,
		secondname,
		email,
		avatarpath,
		password,
		phone,
		role,
	}: UserEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO ${this.getTableName()}
				(login, firstname, secondname, email, avatarpath, password, phone, role)
			VALUES
				(?, ?, ?, ?, ?, ?, ?, ?)
		`,
			[login, firstname, secondname, email, avatarpath, password, phone, role]
		);
		return lastID as bigint;
	}
	public getPublicDataByID(id: number): UserEntryPublic | null {
		const entry = this.storage.get<UserEntryPublic>(
			`
				SELECT
					firstname, secondname, email, avatarpath
				FROM
					${this.getTableName()}
				WHERE
					id = ?
			`,
			[id]
		);
		return entry ? entry : null;
	}
	public update({
		id,
		login,
		firstname,
		secondname,
		email,
		avatarpath,
		password,
		phone,
		role,
	}: UserEntry): number {
		const { changes } = this.storage.run(
			`
				UPDATE ${this.getTableName()} SET
					login = ?,
					firstname = ?,
					secondname = ?,
					email = ?,
					avatarpath = ?,
					password = ?,
					phone = ?,
					role = ?
				WHERE
					id = ?
			`,
			[
				login,
				firstname,
				secondname,
				email,
				avatarpath,
				password,
				phone,
				role,
				id,
			]
		);
		return changes;
	}
	public getByLogin(login: string): UserEntry | null {
		const res = this.storage.get<UserEntry>(
			`
				SELECT * FROM ${this.getTableName()} WHERE login = ?
			`,
			[login]
		);
		return res ? res : null;
	}
}
