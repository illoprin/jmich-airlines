import { Storage } from "./storage";

export abstract class BaseRepository<T> {
	constructor(protected storage : Storage) {}

	public abstract getTableName(): string;
	public getByID(id : number) : T | unknown {
		try {
			const entry : T | unknown = this.storage.get(`SELECT * FROM ${this.getTableName()} WHERE id = ?`, [id]);
			return entry ? entry : undefined;
		} catch (err) {
			throw err;
		}
	}
}