import type { UserEntry, UserEntryPublic } from "../types/user.type";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserEntry> {
	public getTableName(): string {
		return "user";
	}
	public create() {
		// Create table
		this.storage.run(`
			CREATE TABLE IF NOT EXISTS user(
				id INTEGER PRIMARY KEY,
				login TEXT NOT NULL UNIQUE,
				firstname TEXT NOT NULL,
				secondname TEXT NOT NULL,
				phone TEXT NOT NULL CHECK(length(phone) == 10),
				email TEXT NOT NULL UNIQUE,
				password_hash TEXT NOT NULL,
				avatarpath TEXT DEFAULT '/upload/protected/avatar_default.jpg',
				role TEXT NOT NULL CHECK(role IN ( 'CUSTOMER', 'MODERATOR', 'ADMIN' ))
			);
		`, []);
		// Create index
		this.storage.run(`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_user BY user(login)
		`, []);
	}
	public add({
		login,
		firstname,
		secondname,
		email,
		avatarpath,
		password_hash,
		phone,
		role,
	}: UserEntry): bigint {
		try {
			const { lastID } = this.storage.run(
				`
				INSERT INTO user
					(login, firstname, secondname, email, avatarpath, password, phone, role)
				VALUES
					(?, ?, ?, ?, ?, ?, ?, ?)
			`,
				[
					login,
					firstname,
					secondname,
					email,
					avatarpath,
					password_hash,
					phone,
					role,
				]
			);
			return lastID as bigint;
		} catch (err) {
			throw err;
		}
	}
	public getPublicDataByID(id: number): UserEntryPublic | undefined {
		try {
			const entry = this.storage.get(
				`
				SELECT
					firstname, secondname, email, avatarpath FROM user
				WHERE
					id = ?
			`,
				[id]
			);
			return entry ? entry as UserEntryPublic : undefined;
		} catch (err) {
			throw err;
		}
	}
	public update({
		id,
		login,
		firstname,
		secondname,
		email,
		avatarpath,
		password_hash,
		phone,
		role,
	}: UserEntry): number {
		try {
			const { changes } = this.storage.run(
				`
				UPDATE user SET
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
					password_hash,
					phone,
					role,
					id,
				]
			);
			return changes;
		} catch (err) {
			throw err;
		}
	}
	public delete(id: number): number {
		try {
			const {changes} = this.storage.run(`
				DELETE FROM user WHERE id = ?
			`, [id]);
			return changes;
		} catch (err) {
			throw err;
		}
	}
}