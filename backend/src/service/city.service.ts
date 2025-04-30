import {
	StorageError,
	StorageErrorType,
} from "../lib/repository/storage-error";
import type { AirportRepository } from "../repository/airport.repository";
import type { CityRepository } from "../repository/city.repository";
import type { AirportEntry, CityDTO, CityEntry } from "../types/city.type";
import {
	NotFoundError,
	NotUniqueError,
	RelatedDataError,
} from "../types/service.type";

export class CityService {
	constructor(
		private cityRepo: CityRepository,
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
				}
			}
			throw err;
		}
	}

	public getCityByID(id: number): CityEntry {
		const entry = this.cityRepo.getByID(id);
		if (!entry) {
			throw new NotFoundError("city not found");
		}
		return entry;
	}

	public getAllCities(): CityDTO[] {
		const entries = this.cityRepo.getDTOAll();
		return entries ?? [];
	}

	public updateCityByID(id: number, payload: any) {
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
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
				}
			}
			throw err;
		}
	}

	public removeCityByID(id: number) {
		try {
			const changes = this.cityRepo.removeByID(id);
			if (!changes) {
				throw new NotFoundError("city not found");
			}
		} catch (err) {
			if (err instanceof StorageError) {
				if (err.type == StorageErrorType.CHECK) {
					throw new RelatedDataError("this city linked with another object");
				}
			}
			throw err;
		}
	}

	public addAirport(airport: AirportEntry): bigint {
		try {
			const lastID = this.airportRepo.add(airport);
			return lastID;
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
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

	public updateAirportByCodeAndCityID(city_id: number, code: string, payload: any) {
		const entry = this.airportRepo.getByCode(code);
		if (!entry) {
			throw new NotFoundError("airport not found");
		}

		if (city_id !== entry.city_id) {
			throw new RelatedDataError(`this city has not airport with code '${code}'`);
		}

		const updated: AirportEntry = {
			name: payload.name ?? entry.name,
			code: payload.code ?? entry.code,
			city_id: payload.city_id ?? entry.city_id,
		};

		try {
			this.airportRepo.update(entry.id as number, updated);
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
				}
			}
			throw err;
		}
	}

	public removeCityAirportByCodeAndCityID(city_id: number, code: string) {
		try {
			const changes = this.airportRepo.removeByCodeAndCityID(city_id, code);
			if (!changes) {
				throw new NotFoundError("airport not found");
			}
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
