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

	public getCityByID(id: number): CityDTO {
		const entry = this.cityRepo.getDTOByID(id);
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

	public getAirportByID(id: number): AirportEntry {
		const entry = this.airportRepo.getByID(id);
		if (!entry) {
			throw new NotFoundError("airport not found");
		}
		return entry;
	}

	public getAllAirports(): AirportEntry[] {
		const entry = this.airportRepo.getAll();
		return entry || [];
	}

	public updateAirportByID(id: number, payload: any) {
		const entry = this.airportRepo.getByID(id);
		if (!entry) {
			throw new NotFoundError("airport not found");
		}

		const updated: AirportEntry = {
			id: entry.id,
			name: payload.name ?? entry.name,
			code: payload.code ?? entry.code,
			city_id: payload.city_id ?? entry.city_id,
		};

		try {
			this.airportRepo.update(id, updated);
		} catch (err) {
			if (err instanceof StorageError) {
				if ((err as StorageError).type == StorageErrorType.UNIQUE) {
					throw new NotUniqueError("city entry is not unique");
				}
			}
			throw err;
		}
	}

	public removeAirportByID(id: number) {
		try {
			const changes = this.airportRepo.removeByID(id);
			if (!changes) {
				throw new NotFoundError("city not found");
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
