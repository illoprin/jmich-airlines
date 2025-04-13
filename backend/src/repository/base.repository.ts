import { Storage } from "./storage";

export abstract class BaseRepository<T> {
	constructor(protected storage : Storage) {
		this.create();
	}
	protected abstract create(): void;
	public abstract getTableName(): string;
	
	public getByID(id : number) : T | undefined {
		try {
			const entry = this.storage.get(`SELECT * FROM ${this.getTableName()} WHERE id = ?`, [id]);
			return entry ? entry as T : undefined;
		} catch (err) {
			throw err;
		}
	}
}