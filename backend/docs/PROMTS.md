## Промты ChatGPT
Я пишу онлайн-сервис для покупки дешевых авиабилетов и сейчас работаю над серверным приложением.

Можешь, пожалуйста, помочь написать репозиторий для записей о перелётах. (база данных SQLite, реализация в Node better-sqlite3 (без структур Promise))

Структура таблицы flight выглядит следующим образом
```
id - number primary key
route_code - string # одна буква и три числа, например B301 (добавь валидацию на уровне sql)
departure_city_id - number # id города вылета из таблицы city
arrival_city_id - number # id города прибытия из таблицы city
departure_date - datetime # дата и время вылета
arrival_date - datetime # дата и время вылета
company_id - number # id компании совершающей авиаперелёт из таблицы company
seats_available - number # количество доступных мест, число до 512
price - number # цена за один авиабилет
status - string check(status on 'ACTIVE' 'COMPLETED' 'DELAYED' 'CANCELLED') # текущий 'статус' авиаперелёта, строка, которая определяет активен ли перелёт, завершён, задерживается или отменён.
```

У меня уже есть готовый базовый класс для репозитория.
```typescript
export abstract class BaseRepository<T> {
	constructor(protected storage: Storage) {
		this.create();
	}
	public abstract getTableName(): string;

	/**
	 * Create table in database
	 */
	protected abstract create(): void;

	/**
	 * Delete database entry
	 * @param id - id of entry
	 * @returns rows affected
	 */
	public removeByID(id: number): number {
		const { changes } = this.storage.run(
			`
				DELETE FROM ${this.getTableName()} WHERE id = ?
			`,
			[id]
		);
		return changes;
	}

	/**
	 *
	 * @param id - id of entry
	 * @returns template object or null, if nothing is found
	 */
	public getByID(id: number): T | null {
		const entry = this.storage.get<T>(
			`SELECT * FROM ${this.getTableName()} WHERE id = ?`,
			[id]
		);
		return entry ? entry : null;
	}

	public getAll(): T[] | null {
		const entries = this.storage.all<T>(
			`SELECT * FROM ${this.getTableName()}`,
			[]
		);
		return entries ? entries : null;
	}
}
```

А также базовый интерфейс, от которого наследуются все интерфейсы записей
```typescript
export interface Entry {
	id?: number;
}

// For example: UserEntry
export interface UserEntry extends Entry {
	login: string;
	firstname: string;
	secondname: string;
	phone: string;
	email: string;
	password: string;

	avatarpath?: string;
	role?: Roles;
}
```

Также прилагаю пример уже готового UserRepository, чтобы ввести тебя в контекст
```typescript
export class UserRepository extends BaseRepository<UserEntry> {
	public getTableName(): string {
		return "user";
	}
	public create() {
		// Create table
		this.storage.run(
			`
			CREATE TABLE IF NOT EXISTS ${this.getTableName()}(
				id INTEGER PRIMARY KEY,
				login TEXT NOT NULL UNIQUE,
				firstname TEXT NOT NULL,
				secondname TEXT NOT NULL,
				phone TEXT NOT NULL CHECK(length(phone) == 10),
				email TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				avatarpath TEXT DEFAULT '/upload/protected/avatar_default.jpg',
				role INTEGER DEFAULT 1
			);
		`,
			[]
		);
		// Create index
		this.storage.run(
			`
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
		avatarpath,
		password,
		phone,
		role,
	}: UserEntry): bigint {
		const { lastID } = this.storage.run(
			`
			INSERT INTO ${this.getTableName()}
				(login, firstname, secondname, email, avatarpath, password, phone, role)
			VALUES
				(?, ?, ?, ?, ?, ?, ?, ?)
		`,
			[login, firstname, secondname, email, avatarpath, password, phone, role]
		);
		return lastID as bigint;
	}
	public getPublicDataByID(id: number): UserEntryPublic | null {
		const entry = this.storage.get<UserEntryPublic>(
			`
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
			`
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
			`
				SELECT * FROM ${this.getTableName()} WHERE login = ?
			`,
			[login]
		);
		return res ? res : null;
	}
}
```

Самая главная функция, которую необходимо реализовать это search по: городу отправления, городу прибытия, дате вылета и количества свободных мест. Поиск должен выдать все АКТИВНЫЕ перелёты удовлетворяющие условию.

И вообще, как ты думаешь, эту функцию лучше поместить в репозиторий или сервис?
Сможешь написать в моём codestyle и дать советы по улучшению архитектуры?

```
Таблица booking (
	id - integer
	flight_id - integer foreign key to flight(id)
	user_id - integer foreign key to user(id)
	baggage_weight - integer
	qr_code - text # ссылка на изображения qr кода (к примеру, http://localhost:8000/static/booking/qr.jpg)
	cost - integer # общая стоимость брони
)
```
1. в сервисе booking сделать функцию удаленя промо-кодов для которых истёк срок действия 30 дней назад
2. придумать как соединить таблицу flight с city airport и company

## Объединение таблиц

Помнишь мы обсуждали написание FlightRepository. Так вот, я решил немного поменять стркутуру таблицы.
Заменил поля departure_city_id на departure_airport_id и arrival_city_id на arrival_airport_id.

```typescript
export interface FlightEntry extends Entry {
	route_code: string;
	departure_airport_id: number;
	arrival_airport_id: number;
	departure_date: Date;
	arrival_date: Date;
	company_id: number;
	seats_available?: number;
	price: number;
	status?: FlightStatus;
	cheapest?: boolean;
}
```

```sql
CREATE TABLE IF NOT EXISTS flight(
	id INTEGER PRIMARY KEY,
	route_code TEXT NOT NULL CHECK(route_code GLOB '[A-Z][0-9][0-9][0-9]'),
	departure_airport_id INTEGER NOT NULL,
	arrival_airport_id INTEGER NOT NULL,
	departure_date DATETIME NOT NULL CHECK(departure_date > CURRENT_TIMESTAMP),
	arrival_date DATETIME NOT NULL,
	company_id INTEGER NOT NULL,
	seats_available INTEGER NOT NULL CHECK(seats_available BETWEEN 0 AND 512),
	price REAL NOT NULL,
	status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'COMPLETED', 'DELAYED', 'CANCELLED')),
	
	FOREIGN KEY(departure_airport_id) REFERENCES airport(id) ON DELETE SET NULL,
	FOREIGN KEY(arrival_airport_id) REFERENCES airport(id) ON DELETE SET NULL,
	FOREIGN KEY(company_id) REFERENCES company(id) ON DELETE SET NULL
);
```

Соответственно появились дополнительные таблицы City и Airport

```sql
CREATE TABLE IF NOT EXISTS city(
	id NUMBER PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	image TEXT NOT NULL DEFAULT '/upload/city_default.jpg'
)
```

```sql
CREATE TABLE IF NOT EXISTS airport(
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	code TEXT NOT NULL CHECK(code GLOB '[A-Z][A-Z][A-Z]'),
	city_id INTEGER NOT NULL,
	FOREIGN KEY(city_id) REFERENCES city(id) ON DELETE CASCADE
);
```

Я задумался как я буду фетчить результат в Frontend приложении. Мне же необходимо вывести наименование города вылета, наименование города прибытия, наименование и логотип авиакомпании, но FlightEntry не даёт таких данных, а он содержит лишь ссылки на записи в другой таблице

К примеру, можно фетчить города и компании по id-шникам для каждой записи. При поиске на странице будет отображаться минимум 10 записей для каждой записи надо раскрыть город и компанию. Значит это 10 запросов к серверу и 10 запросов от севрвера к БД. Можно ли так делать? Мне кажется это не очень эффективным

Хорошо бы в репозитории Flight делать LEFT JOIN (соединить таблицы по id) и сразу выдать запись такого вида:
```json
{
	"route_code": "B565",
	"departure_city": {
		"name": "Samara",
		"airport": "KUF",
		"img": "path/to/image"
	},
	"arrival_city": {
		"name": "Moscow",
		"airport": "SVO",
		"img": "path/to/image"
	},
	"departure_date": "2020-01-01 15:34",
	"arrival_date": "2020-01-01 19:21",
	"company": {
		"name": "Aeroflot",
		"logo": "path/to/image",
		"baggage_rule": {
			"max_free_weight": 5,
			"price_per_kg": 1250,
		}
	},
	"seats_available": 35,
	"price": 6280,
	"status": "ACTIVE"
}
```

Какое решение лучше выбрать в этой ситуации? Может у тебя есть свои идеи по этому поводу?

## Кеширование

По поводу кеширования в Redis - это отличная идея, только надо прояснить некоторые моменты.
Как лучше это реализовать?

Допустим произошёл такой случай:
1. Админ поменял запись об аеропорту в БД. (KUF -> KVO)
2. Пользователь на Frontend хочет получить записи о городах и аеропортах
3. Сервис лезет в кеш и находит там старую запись об аэропорту, до изменений админа
4. Пользователь получает устаревшый вид записи
