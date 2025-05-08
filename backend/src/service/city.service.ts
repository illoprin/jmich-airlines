import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import { CityCache } from "../redis/city.cache";
import type { AirportRepository } from "../repository/airport.repository";
import type { CityRepository } from "../repository/city.repository";
import type { CityEntry } from "../types/repository/city";
import type { CityDTO } from "../types/dto/city";
import type { AirportEntry } from "../types/repository/city";
import {
	InvalidFieldError,
	NotFoundError,
	NotUniqueError,
	RelatedDataError,
} from "../lib/service/errors";

export class CityService {
	constructor(
		private cityRepo: CityRepository,
		private cityCache: CityCache,
		private airportRepo: AirportRepository
	) {}

	public addCity(city: CityEntry): bigint {
		try {
			const lastID = this.cityRepo.add(city);
			return lastID;
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
				} else if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError("some fields are not filled in");
				}
			}
			throw err;
		}
	}

	public async getCityByID(id: number): Promise<CityEntry> {
		const cachedEntries = await this.cityCache.getAll();
		const cachedEntry = cachedEntries?.find((city) => city.id == id);
		if (!cachedEntry) {
			const entry = this.cityRepo.getByID(id);
			if (!entry) {
				throw new NotFoundError("city not found");
			}
			return entry;
		}
		return cachedEntry;
	}

	public async getAllCities(): Promise<CityDTO[]> {
		// Check existence of data in cache
		const cachedCities = await this.cityCache.getAll();
		if (!cachedCities) {
			// Get entries from db repo
			const entries = this.cityRepo.getDTOAll();
			if (!entries) {
				return [];
			}
			// Write entries to cache
			await this.cityCache.setAll(entries);
			return entries;
		}
		return cachedCities;
	}

	public async updateCityByID(id: number, payload: any): Promise<void> {
		const city = this.cityRepo.getByID(id);
		if (!city) {
			throw new NotFoundError("city not found");
		}
		const updated: CityEntry = {
			id: city.id,
			image: payload.image ?? city.image,
			name: payload.name ?? city.name,
		};
		try {
			this.cityRepo.update(id, updated);
			await this.cityCache.invalidate();
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
				}
			}
			throw err;
		}
	}

	public async removeCityByID(id: number): Promise<void> {
		try {
			const changes = this.cityRepo.removeByID(id);
			if (!changes) {
				throw new NotFoundError("city not found");
			}
			await this.cityCache.invalidate();
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new RelatedDataError("this city linked with another object");
				}
			}
			throw err;
		}
	}

	public async addAirport(airport: AirportEntry): Promise<bigint> {
		try {
			const lastID = this.airportRepo.add(airport);
			await this.cityCache.invalidate();
			return lastID;
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("airport entry is not unique");
				} else if (err.type == StorageErrorType.CHECK) {
					throw new InvalidFieldError(
						`invalid field '${err.field.split(" ")[0]}'`
					);
				}
			}
			throw err;
		}
	}

	public getAirportsByCityID(city_id: number): AirportEntry[] {
		const entries = this.airportRepo.getByCityID(city_id);
		return entries ?? [];
	}

	public getAirportByCode(code: string): AirportEntry {
		const entry = this.airportRepo.getByCode(code);
		if (!entry) {
			throw new NotFoundError("airport not found");
		}
		return entry;
	}

	public async updateAirportByCodeAndCityID(
		city_id: number,
		code: string,
		payload: any
	) {
		const entry = this.airportRepo.getByCode(code);
		if (!entry) {
			throw new NotFoundError("airport not found");
		}

		if (city_id !== entry.city_id) {
			throw new RelatedDataError(
				`this city has not airport with code '${code}'`
			);
		}

		const updated: AirportEntry = {
			name: payload.name ?? entry.name,
			code: payload.code ?? entry.code,
			city_id: payload.city_id ?? entry.city_id,
		};

		try {
			this.airportRepo.update(entry.id as number, updated);
			await this.cityCache.invalidate();
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
				}
			}
			throw err;
		}
	}

	public getAllAirports(): AirportEntry[] {
		const airports = this.airportRepo.getAll();
		return airports ?? [];
	}

	public async removeCityAirportByCodeAndCityID(
		city_id: number,
		code: string
	): Promise<void> {
		try {
			const changes = this.airportRepo.removeByCodeAndCityID(city_id, code);
			if (!changes) {
				throw new NotFoundError("airport not found");
			}
			await this.cityCache.invalidate();
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new RelatedDataError("this airport linked with another object");
				}
			}
			throw err;
		}
	}
}
