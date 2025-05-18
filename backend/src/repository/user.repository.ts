import type { UserEntry } from "@/types/repository/user";
import type { UserPublicDTO } from "@/types/dto/user";
import { BaseRepository } from "@/lib/repository/base.repository";

export class UserRepository extends BaseRepository<UserEntry> {
  public getTableName(): string {
    return "user";
  }
  protected create() {
    // Create table
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				login TEXT NOT NULL UNIQUE,
				firstname TEXT NOT NULL,
				secondname TEXT NOT NULL,
				phone TEXT NOT NULL CHECK(length(phone) == 10),
				email TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				avatarpath TEXT DEFAULT '/upload/protected/avatar_default.jpg',
				role INTEGER DEFAULT 1,
				level TEXT NOT NULL CHECK(level IN ('Basic', 'Silver', 'Gold', 'Premium', 'Platinum')) DEFAULT 'Basic'
			);
		`,
      [],
    );

    // Create indexes for search optimization
    this.storage.run(
      `--sql
				CREATE UNIQUE INDEX IF NOT EXISTS idx_${this.getTableName()} ON ${this.getTableName()}(login)
			`,
      [],
    );
  }
  public add({
    login,
    firstname,
    secondname,
    email,
    password,
    avatarpath,
    phone,
    role,
    level,
  }: UserEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
				INSERT INTO ${this.getTableName()}
					(login, firstname, secondname, email, password, phone, role, level, avatarpath)
				VALUES
					(?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
      [login, firstname, secondname, email, password, phone, role, level, avatarpath],
    );
    return lastID as bigint;
  }
  public getPublicDataByID(id: number): UserPublicDTO | null {
    const entry = this.storage.get<UserPublicDTO>(
      `--sql
				SELECT
					firstname, secondname, email, avatarpath, level
				FROM
					${this.getTableName()}
				WHERE
					id = ?
			`,
      [id],
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
    level,
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
					level = ?,
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
        level,
        role,
        id,
      ],
    );
    return changes;
  }

  public getByLogin(login: string): UserEntry | null {
    const res = this.storage.get<UserEntry>(
      `--sql
				SELECT * FROM ${this.getTableName()} WHERE login = ?
			`,
      [login],
    );
    return res ? res : null;
  }
}
