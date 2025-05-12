import { BaseRepository } from "../lib/repository/base.repository";
import { parseJSONArray } from "../lib/repository/parse";
import type { FlightDTO } from "../types/dto/flight";
import type { LikedFlightEventPayload } from "../types/features/notification";
import type { LikedFlightEntry } from "../types/repository/liked-flight";

export class LikedFlightRepository extends BaseRepository<LikedFlightEntry> {
  public getTableName(): string {
    return "liked_flight";
  }
  public getJSONFieldName(): string {
    return "liked_flight_json";
  }

  private getFlightDTOQuery(whereClause: string): string {
    return `--sql
			SELECT json_object(
				'id', flight.id,
				'route_code', flight.route_code,
				'departure_city', json_object(
					'id', depc.id,
					'name', depc.name,
					'image', depc.image,
					'airport', json_object(
						'id', depa.id,
						'code', depa.code,
						'name', depa.name
					)
				),
				'arrival_city', json_object(
					'id', arrc.id,
					'name', arrc.name,
					'image', arrc.image,
					'airport', json_object(
						'id', arra.id,
						'code', arra.code,
						'name', arra.name
					)
				),
				'company', json_object(
					'id', c.id,
					'name', c.name,
					'logo', c.logo,
					'baggage_rule', json_object(
						'max_free_weight', b.max_free_weight,
						'price_per_kg', b.price_per_kg
					)
				),
				'departure_date', flight.departure_date,
				'arrival_date', flight.arrival_date,
				'price', flight.price,
				'seats_available', flight.seats_available,
				'status', flight.status
			) as ${this.getJSONFieldName()}
			FROM
				${this.getTableName()}
			-- join flight
			LEFT JOIN
				flight ON ${this.getTableName()}.flight_id = flight.id

			-- join departure city
			LEFT JOIN
				airport depa on flight.departure_airport_id = depa.id
			LEFT JOIN
				city depc on depa.city_id = depc.id

			-- join arrival city
			LEFT JOIN
				airport arra on flight.arrival_airport_id = arra.id
			LEFT JOIN
				city arrc on arra.city_id = arrc.id
				
			-- join company and its baggage rule
			LEFT JOIN
				company c on flight.company_id = c.id
			LEFT JOIN
				baggage_rule b on c.baggage_rule_id = b.id

			${whereClause}
			-- order by departure date from lower to max
			ORDER BY flight.departure_date ASC
		`;
  }

  public create(): void {
    // Create table
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
				id INTEGER PRIMARY KEY,
				user_id INTEGER NOT NULL,
				flight_id INTEGER NOT NULL,
				UNIQUE(user_id, flight_id),
				FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
				FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE CASCADE
			)
		`,
      [],
    );
  }

  public add({ user_id, flight_id }: LikedFlightEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
			INSERT OR IGNORE INTO ${this.getTableName()}(user_id, flight_id)
			VALUES
				(?, ?)
		`,
      [user_id, flight_id],
    );
    return lastID as bigint;
  }

  public getAllByUserID(userID: number): FlightDTO[] | null {
    const query = this.getFlightDTOQuery(
      `WHERE ${this.getTableName()}.user_id = ?`,
    );
    const params = [userID];

    const rows = this.storage.all<any>(query, params);
    if (!rows) {
      return [];
    }

    const liked_flights = parseJSONArray<FlightDTO>(
      rows,
      this.getJSONFieldName(),
      (dto) => {
        dto.departure_date = new Date(dto.departure_date);
        dto.arrival_date = new Date(dto.arrival_date);
        return dto;
      },
    );
    return liked_flights;
  }

  public isFlightLikedByUser(userID: number, flightID: number): boolean {
    const res = this.storage.get(
      `--sql
			SELECT 1 FROM ${this.getTableName()} WHERE user_id = ? AND flight_id = ?
		`,
      [userID, flightID],
    );
    return res ? true : false;
  }

  public removeByUserAndFlight(userID: number, flightID: number): number {
    const { changes } = this.storage.run(
      `--sql
			DELETE FROM ${this.getTableName()} WHERE user_id = ? AND flight_id = ?
		`,
      [userID, flightID],
    );
    return changes;
  }

  public getFlightsWithLowSeats(): LikedFlightEventPayload[] | null {
    return this.storage.all<LikedFlightEventPayload>(
      `--sql
		SELECT
			l.user_id, f.route_code, dc.name AS departure_city_name, ac.name AS arrival_city_name, c.logo AS company_logo
		FROM
			liked_flight l
		LEFT JOIN flight f ON l.flight_id = f.id
		LEFT JOIN airport da ON f.departure_airport_id = da.id
		LEFT JOIN city dc ON da.city_id = dc.id
		LEFT JOIN airport aa ON f.arrival_airport_id = aa.id
		LEFT JOIN city ac ON aa.city_id = ac.id
		LEFT JOIN company c ON f.company_id = c.id
		WHERE f.seats_available <= 15
	`,
      [],
    );
  }

  public getFlightsWithExpiringRegistration():
    | LikedFlightEventPayload[]
    | null {
    return this.storage.all<LikedFlightEventPayload>(
      `--sql
		SELECT
			l.user_id, f.route_code, dc.name AS departure_city_name, ac.name AS arrival_city_name, c.logo AS company_logo
		FROM
			liked_flight l
		LEFT JOIN flight f ON l.flight_id = f.id
		LEFT JOIN airport da ON f.departure_airport_id = da.id
		LEFT JOIN city dc ON da.city_id = dc.id
		LEFT JOIN airport aa ON f.arrival_airport_id = aa.id
		LEFT JOIN city ac ON aa.city_id = ac.id
		LEFT JOIN company c ON f.company_id = c.id
		WHERE datetime(f.departure_date) <= datetime('now', '+12 hours')
	`,
      [],
    );
  }
}
