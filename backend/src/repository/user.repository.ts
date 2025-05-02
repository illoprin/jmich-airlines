import type { UserEntry, UserPublicDTO } from "../types/user.type";
import { BaseRepository } from "../lib/repository/base.repository";

export class UserRepository extends BaseRepository<UserEntry> {
	public getTableName(): string {
		return "user";
	}
	protected create() {
		// Create table
		this.storage.run(`--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				login TEXT NOT NULL UNIQUE,
				firstname TEXT NOT NULL,
				secondname TEXT NOT NULL,
				phone TEXT NOT NULL CHECK(length(phone) == 10),
				email TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				avatarpath TEXT DEFAULT '/upload/user/avatar_default.jpg',
				role INTEGER DEFAULT 1
			);
		`,
			[]
		);

		// Create indexes for search optimization
		this.storage.run(
			`--sql
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
		password,
		phone,
		role,
	}: UserEntry): bigint {
		const { lastID } = this.storage.run(
			`--sql
				INSERT INTO ${this.getTableName()}
					(login, firstname, secondname, email, password, phone, role)
				VALUES
					(?, ?, ?, ?, ?, ?, ?)
			`,
			[login, firstname, secondname, email, password, phone, role]
		);
		return lastID as bigint;
	}
	public getPublicDataByID(id: number): UserPublicDTO | null {
		const entry = this.storage.get<UserPublicDTO>(
			`--sql
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
			`--sql
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
			`--sql
				SELECT * FROM ${this.getTableName()} WHERE login = ?
			`,
			[login]
		);
		return res ? res : null;
	}
}
