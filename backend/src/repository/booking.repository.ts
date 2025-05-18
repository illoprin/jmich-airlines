import { type BookingEntry, BookingStatus } from "@/types/repository/booking";
import type { BookingDTO } from "@/types/dto/booking";
import { TrandingBookingsDTO } from "@/types/features/booking";
import { BaseRepository } from "@/lib/repository/base.repository";
import { parseJSONArray } from "@/lib/repository/parse";
import { FlightStatus } from "@/types/repository/flight";

export class BookingRepository extends BaseRepository<BookingEntry> {
  public getTableName(): string {
    return "booking";
  }

  private getJSONFieldName(): string {
    return "booking_json";
  }

  protected create(): void {
    this.storage.run(
      `--sql
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				flight_id INTEGER NOT NULL,
				user_id INTEGER NOT NULL,
				baggage_weight INTEGER NOT NULL CHECK(baggage_weight >= 0),
				created DATETIME DEFAULT CURRENT_TIMESTAMP,
				qr_code TEXT NOT NULL,
				seats INTEGER NOT NULL CHECK(seats > 0),
				cost INTEGER CHECK(cost >= 0),
				status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'CANCELLED', 'COMPLETED')) DEFAULT 'ACTIVE',

				FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE SET NULL,
				FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
			)
		`,
      [],
    );

    this.storage.run(
      `--sql
				CREATE INDEX IF NOT EXISTS idx_booking_user ON ${this.getTableName()}(user_id)
			`,
      [],
    );

    this.storage.run(
      `--sql
				CREATE INDEX IF NOT EXISTS idx_booking_flight ON ${this.getTableName()}(flight_id)
			`,
      [],
    );
  }

  public add({
    flight_id,
    user_id,
    baggage_weight,
    qr_code,
    created,
    seats,
    cost,
  }: BookingEntry): bigint {
    const { lastID } = this.storage.run(
      `--sql
			INSERT INTO ${this.getTableName()}
				(flight_id, user_id, baggage_weight, qr_code, seats, created, cost)
			VALUES
				(?, ?, ?, ?, ?, ?, ?)
		`,
      [
        flight_id,
        user_id,
        baggage_weight,
        qr_code,
        seats,
        created.toISOString(),
        cost,
      ],
    );
    return lastID as bigint;
  }

  private getDTOQuery(whereClause: string, usePagination: boolean) {
    return `--sql
			SELECT json_object(
				'id', booking.id,
				'user_id', booking.user_id,
				'baggage_weight', booking.baggage_weight,
				'qr_code', booking.qr_code,
				'created', booking.created,
				'seats', booking.seats,
				'cost', booking.cost,
				'status', booking.status,
				'flight', json_object(
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
				)
			) as ${this.getJSONFieldName()}
			FROM
				${this.getTableName()}
			
			LEFT JOIN
				flight on booking.flight_id = flight.id
			LEFT JOIN
				airport depa on flight.departure_airport_id = depa.id
			LEFT JOIN
				city depc on depa.city_id = depc.id

			LEFT JOIN
				airport arra on flight.arrival_airport_id = arra.id
			LEFT JOIN
				city arrc on arra.city_id = arrc.id
				
			LEFT JOIN
				company c on flight.company_id = c.id
			LEFT JOIN
				baggage_rule b on c.baggage_rule_id = b.id

			${whereClause}
			ORDER BY flight.departure_date ASC
			${usePagination ? "LIMIT ? OFFSET ?" : ""}
		`;
  }

  private getTrandingQuery(): string {
    return `--sql
			SELECT
				count(flight.id) as popularity,
				flight.id as flight_id,
				dc.name as departure_city_name,
				dc.image as departure_city_image,
				da.code as departure_airport_code,
				flight.departure_date,
				
				ac.name as arrival_city_name,
				ac.image as arrival_city_image,
				aa.code as arrival_airport_code,
				flight.arrival_date,
				flight.price
			FROM
				booking

			-- join flight
			LEFT JOIN
				flight ON booking.flight_id = flight.id

			-- join departure city
			LEFT JOIN
				airport da ON flight.departure_airport_id = da.id
			LEFT JOIN
				city dc ON da.city_id = dc.id

			-- join arrival city
			LEFT JOIN
				airport aa ON flight.arrival_airport_id = aa.id
			LEFT JOIN
				city ac ON aa.city_id = ac.id
			WHERE
				flight.status = 'ACTIVE'
			GROUP BY
				flight.id
			ORDER BY
				count(flight.id) DESC
			LIMIT ? 
		`;
  }

  public getDTORow(row: any): any {
    row.flight.departure_date = new Date(row.flight.departure_date);
    row.flight.arrival_date = new Date(row.flight.arrival_date);
    row.created = new Date(row.created);
    return row;
  }

  public getDTOByUserID(
    user_id: number,
    max?: number,
    page?: number,
  ): BookingDTO[] | null {
    const whereClause = `WHERE ${this.getTableName()}.user_id = ?`;
    let params: any[] = [user_id];

    let pagination = false;
    if (max != undefined && page != undefined) {
      pagination = true;
      params.push(max, page * max);
    }

    const rows = this.storage.all<any>(
      this.getDTOQuery(whereClause, pagination),
      params,
    );

    if (!rows) {
      return null;
    }

    const dtos = parseJSONArray<BookingDTO>(
      rows,
      this.getJSONFieldName(),
      (dto) => this.getDTORow(dto),
    );

    return dtos;
  }

  public getCountByUserID(
    userID: number,
    status: BookingStatus = BookingStatus.ACTIVE
  ): number {
    const sql = `--sql
      SELECT COUNT(*) as count
      FROM
        ${this.getTableName()}
      WHERE
        user_id = ?
      AND
        status = ?
    `;
    const row = this.storage.get(sql, [userID, status]);
    return parseInt(row.count);
  }

  public getDTOByID(id: number): BookingDTO | null {
    const row = this.storage.get<any>(
      this.getDTOQuery(`WHERE ${this.getTableName()}.id = ?`, false),
      [id],
    );
    if (!row) {
      return null;
    }
    const booking: BookingDTO = JSON.parse(row[this.getJSONFieldName()]);
    return this.getDTORow(booking);
  }

  public updateStatus(id: number, status: BookingStatus): number {
    const { changes } = this.storage.run(
      `--sql
			UPDATE ${this.getTableName()} SET status = ? WHERE id = ? 
			`,
      [status, id],
    );
    return changes;
  }

  public getDTOAll(max?: number, page?: number): BookingDTO[] | null {
    let params: any[] = [];

    let pagination = false;
    if (max != undefined && page != undefined) {
      pagination = true;
      params.push(max, page * max);
    }

    const rows = this.storage.all<any>(this.getDTOQuery("", true), params);

    if (!rows) {
      return null;
    }

    const dtos = parseJSONArray<BookingDTO>(
      rows,
      this.getJSONFieldName(),
      (dto) => this.getDTORow(dto),
    );

    return dtos;
  }

  public getByUserID(user_id: number): BookingEntry[] | null {
    const entries = this.storage.all<BookingEntry>(
      `--sql
			SELECT * FROM ${this.getTableName()} WHERE user_id = ?
		`,
      [user_id],
    );
    return entries;
  }

  public getByFlightID(flight_id: number): BookingEntry[] | null {
    const entries = this.storage.all<BookingEntry>(
      `--sql
			SELECT * FROM ${this.getTableName()} WHERE flight_id = ?
		`,
      [flight_id],
    );
    return entries;
  }

  public completeExpired(statusToSet: BookingStatus): number {
    const query = `--sql
			UPDATE ${this.getTableName()} SET
				status = ?
			WHERE flight_id IN (
				SELECT
					id
				FROM
					flight
				WHERE
					(status = ? OR status = ?)
			)
			AND
				status = ?
		`;
    const { changes } = this.storage.run(query, [
      statusToSet,
      FlightStatus.CANCELLED,
      FlightStatus.COMPLETED,
      BookingStatus.ACTIVE,
    ]);
    return changes;
  }

  public getTrending(limit: number): TrandingBookingsDTO[] | null {
    const query = this.getTrandingQuery();
    const params: number[] = [limit];
    const tranding = this.storage.all<TrandingBookingsDTO>(query, params);
    return tranding;
  }
}
