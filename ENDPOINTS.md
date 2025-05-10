# API Documentation

## Table of Contents

- [Booking Routes](#booking-routes)
- [City Routes](#city-routes)
- [Company Routes](#company-routes)
- [Flight Routes](#flight-routes)
- [Payment Routes](#payment-routes)
- [User Routes](#user-routes)

## General

Total count of endpoints is: **51**

### Booking Routes

| Method | Endpoint                         | Description                  | Status                                    |
| ------ | -------------------------------- | ---------------------------- | ----------------------------------------- |
| GET    | /booking/tranding                | Get trending bookings        |                                           |
| GET    | /booking/:id                     | Get booking by ID            | Authorization                             |
| POST   | /booking/                        | Create new booking           | Authorization, Validation                 |
| GET    | /booking/                        | Get user's bookings          | Authorization                             |
| PUT    | /booking/status/:id              | Update booking status        | Authorization                             |
| GET    | /booking/all?limit=&page=        | Get all bookings (paginated) | Authorization, Admin Role                 |
| DELETE | /booking/:id                     | Delete booking               | Authorization, Admin Role                 |
| POST   | /booking/discount                | Add new discount code        | Authorization, Moderator role, Validation |
| POST   | /booking/discount/validate/:code | Validate discount code       | Authorization                             |
| DELETE | /booking/discount/:code          | Delete discount code         | Authorization, Moderator Role             |

### City Routes

| Method | Endpoint                | Description              | Status                                |
| ------ | ----------------------- | ------------------------ | ------------------------------------- |
| GET    | /city/                  | Get all cities           |
| GET    | /city/:id               | Get city by ID           |
| GET    | /city/:id/airports      | Get airports for a city  |
| POST   | /city/                  | Add new city             | Authorization, Admin Role, Validation |
| PUT    | /city/:id               | Update city              | Authorization, Admin Role, Validation |
| DELETE | /city/:id               | Remove city              | Authorization, Admin Role             |
| POST   | /city/:id/airport       | Add airport to city      | Authorization, Admin Role, Validation |
| DELETE | /city/:id/airport/:code | Remove airport from city | Authorization, Admin Role             |
| PUT    | /city/:id/airport/:code | Update airport           | Authorization, Admin Role, Validation |

## Company Routes

| Method | Endpoint          | Description                | Requirements                          |
| ------ | ----------------- | -------------------------- | ------------------------------------- |
| POST   | /company/         | Add new company            | Authorization, Admin Role, Validation |
| GET    | /company/         | Get all companies          | Authorization, Admin Role             |
| GET    | /company/:id      | Get company by ID          | Authorization, Admin Role             |
| GET    | /company/:id/rule | Get company's baggage rule | Authorization, Admin Role             |
| PUT    | /company/:id      | Update company             | Authorization, Admin Role, Validation |
| DELETE | /company/:id      | Remove company             | Authorization, Admin Role             |
| POST   | /company/rule     | Add baggage rule           | Authorization, Admin Role             |
| PUT    | /company/rule/:id | Update baggage rule        | Authorization, Admin Role             |

## Flight Routes

| Method | Endpoint                         | Description                 |                                           |
| ------ | -------------------------------- | --------------------------- | ----------------------------------------- |
| POST   | /flight/search?limit=&page=      | Search flights              |
| GET    | /flight/:id                      | Get flight by ID            |
| POST   | /flight/                         | Add new flight              | Authorization, Moderator Role, Validation |
| PUT    | /flight/:id                      | Update flight               | Authorization, Moderator Role, Validation |
| PUT    | /flight/:id/status               | Update flight status        | Authorization, Moderator Role             |
| GET    | /flight/all/:status?limit=&page= | Get all flights (paginated) | Authorization, Moderator Role             |
| DELETE | /flight/:id                      | Delete flight               | Authorization, Admin Role                 |
| POST   | /flight/admin/random             | Add random flights          | Authorization, Admin Role                 |

## Payment Routes

| Method | Endpoint          | Description                | Requirements              |
| ------ | ----------------- | -------------------------- | ------------------------- |
| POST   | /user/payment/    | Add payment method         | Authorization, Validation |
| GET    | /user/payment/    | Get user's payment methods | Authorization             |
| GET    | /user/payment/:id | Get payment method by ID   | Authorization             |
| DELETE | /user/payment/:id | Delete payment method      | Authorization             |

## User Routes

| Method | Endpoint                    | Description                     | Requirements                  |
| ------ | --------------------------- | ------------------------------- | ----------------------------- |
| POST   | /user/                      | Register new user               | Validation                    |
| POST   | /user/login                 | Login user                      |                               |
| POST   | /user/liked/:flight_id      | Add flight to user's likes      | Authorization                 |
| POST   | /user/notification          | Get user's notifications        | Authorization                 |
| POST   | /user/notification/:user_id | Send notification to user       | Authorization, Moderator role |
| GET    | /user/liked                 | Get user's liked flights        | Authorization                 |
| DELETE | /user/liked/:flight_id      | Delete flight from user's likes | Authorization                 |
| GET    | /user/                      | Get current user data           | Authorization                 |
| PUT    | /user/                      | Update current user             | Authorization, Validation     |
| DELETE | /user/                      | Delete current user             | Authorization                 |
| GET    | /user/:id                   | Get user public data by ID      | Authorization                 |
| GET    | /user/all?limit=&page=      | Get all users                   | Authorization, Admin Role     |

## With JSON Body

### Booking Routes

#### POST /booking/

**Requires:** Authorization  
**Validation:**

```json
{
	"flight_id": "number (required)",
	"seats": "number (min: 1)",
	"baggage_weight": "number (min: 0)",
	"code": "string"
}
```

**Example:**

```json
{
	"flight_id": 123,
	"seats": 2,
	"payment_id": 1,
	"baggage_weight": 15,
	"code": "SUMMER2023"
}
```

#### GET /booking/

**Requires:** Authorization
**Response:**

```json
{
	"status": "OK",
	"bookings": [
		{
			"id": 2,
			"user_id": 2,
			"baggage_weight": 10,
			"qr_code": "http://localhost:8000/upload/protected/d9b36a67-2f3e-4ed2-9259-695fd258e5de.png",
			"created": "2025-05-09T15:32:17.052Z",
			"seats": 2,
			"cost": 9926,
			"status": "CANCELLED",
			"flight": {
				"id": 1386,
				"route_code": "L466",
				"departure_city": {
					"id": 18,
					"name": "Сеул",
					"image": "/upload/seoul.jpg",
					"airport": {
						"id": 31,
						"code": "GMP",
						"name": "Гимпо"
					}
				},
				"arrival_city": {
					"id": 2,
					"name": "Москва",
					"image": "/upload/moskow.jpg",
					"airport": {
						"id": 2,
						"code": "DME",
						"name": "Домодедово"
					}
				},
				"company": {
					"id": 9,
					"name": "Smartavia",
					"logo": "/upload/smartavia.png",
					"baggage_rule": {
						"max_free_weight": 9,
						"price_per_kg": 3900
					}
				},
				"departure_date": "2025-05-09T15:45:02.746Z",
				"arrival_date": "2025-05-09T19:32:15.691Z",
				"price": 6148.4375,
				"seats_available": 6,
				"status": "ACTIVE"
			}
		}
	]
}
```

#### POST /booking/discount

Create new discount.
**Requires:** Authorizaiton, Admin Role
**Body:**

```json
{
	"code": "string",
	"amount": "float between 0 and 1",
	"valid_until": "date"
}
```

**Example:**

```json
{
	"code": "shaltay-01",
	"amount": 0.02,
	"valid_until": "21 June 2025"
}
```

---

### City Routes

#### POST /city/

**Requires:** Admin Role  
**Example:**

```json
{
	"name": "Москва",
	"image": "/upload/moscow.jpg"
}
```

#### PUT /city/:id

**Requires:** Admin Role  
**Validation:** (same as POST, all fields optional)

```json
{
	"name?": "string",
	"image?": "string"
}
```

#### POST /city/:id/airport

**Requires:** Admin Role  
**Validation:**

```json
{
	"name": "string (SOME_WORDS_SINGLE_SPACE_REGEX)",
	"code": "string (3 uppercase letters)"
}
```

**Example:**

```json
{
	"name": "Международный аэропорт Волгоград",
	"code": "VGO"
}
```

---

### Company Routes

#### POST /company/

**Requires:** Admin Role  
**Validation:**

```json
{
	"name": "string (3-255 chars)",
	"logo": "string (file path)",
	"baggage_rule_id": "number"
}
```

**Example:**

```json
{
	"name": "Аэрофлот",
	"logo": "/uploads/logos/aeroflot.png",
	"baggage_rule_id": 1
}
```

#### POST /company/rule

**Requires:** Admin Role  
**Body:**

```json
{
	"max_free_weight": "number",
	"price_per_kg": "number"
}
```

**Example:**

```json
{
	"max_free_weight": 20,
	"price_per_kg": 5
}
```

---

### Flight Routes

#### POST /flight/

**Requires:** Moderator Role  
**Validation:**

```json
{
	"departure_airport_id": "number",
	"arrival_airport_id": "number",
	"company_id": "number",
	"departure_date": "ISO8601",
	"arrival_date": "ISO8601",
	"route_code": "string (pattern: [A-Z][0-9]{3})",
	"price": "number (min: 1)",
	"seats_available": "number (min: 0)"
}
```

**Example:**

```json
{
	"departure_airport_id": 1,
	"arrival_airport_id": 2,
	"company_id": 1,
	"departure_date": "2023-12-25T08:00:00Z",
	"arrival_date": "2023-12-25T11:00:00Z",
	"route_code": "A123",
	"price": 15000,
	"seats_available": 120
}
```

#### GET /flight/:id

**Response:**

```json
{
	"status": "OK",
	"flight": {
		"id": 95,
		"route_code": "Q870",
		"departure_city": {
			"id": 2,
			"name": "Москва",
			"image": "/upload/moskow.jpg",
			"airport": {
				"id": 2,
				"code": "DME",
				"name": "Домодедово"
			}
		},
		"arrival_city": {
			"id": 2,
			"name": "Москва",
			"image": "/upload/moskow.jpg",
			"airport": {
				"id": 3,
				"code": "SVO",
				"name": "Шереметьево"
			}
		},
		"company": {
			"id": 6,
			"name": "Победа",
			"logo": "/upload/pobeda.png",
			"baggage_rule": {
				"max_free_weight": 2,
				"price_per_kg": 1200
			}
		},
		"departure_date": "2025-05-20T15:43:23.773Z",
		"arrival_date": "2025-05-20T17:44:40.436Z",
		"price": 1296,
		"seats_available": 197,
		"status": "ACTIVE",
		"cheapest": true
	}
}
```

#### POST /flight/search

**Body:**

```json
{
	"departure_airport_id?": "number",
	"arrival_airport_id?": "number",
	"departure_date?": "Date",
	"seats?": "number"
}
```

**Example:**

```json
{
	"departure_airport_id": 1,
	"arrival_airport_id": 2,
	"departure_date": "10 May 2025",
	"seats": 2
}
```

**Response:**

```json
{
	"status": "OK",
	"flights": [
		{
			"id": 95,
			"route_code": "Q870",
			"departure_city": {
				"id": 2,
				"name": "Москва",
				"image": "/upload/moskow.jpg",
				"airport": {
					"id": 2,
					"code": "DME",
					"name": "Домодедово"
				}
			},
			"arrival_city": {
				"id": 2,
				"name": "Москва",
				"image": "/upload/moskow.jpg",
				"airport": {
					"id": 3,
					"code": "SVO",
					"name": "Шереметьево"
				}
			},
			"company": {
				"id": 6,
				"name": "Победа",
				"logo": "/upload/pobeda.png",
				"baggage_rule": {
					"max_free_weight": 2,
					"price_per_kg": 1200
				}
			},
			"departure_date": "2025-05-20T15:43:23.773Z",
			"arrival_date": "2025-05-20T17:44:40.436Z",
			"price": 1296,
			"seats_available": 197,
			"status": "ACTIVE",
			"cheapest": true
		}
	]
}
```

---

### Payment Routes

#### POST /payment/

**Requires:** Authorization  
**Validation:**

```json
{
	"number": "string (16 digits)",
	"expires": "string (4 digits)",
	"cvv": "string (3 digits)"
}
```

**Example:**

```json
{
	"number": "4111111111111111",
	"expires": "1225",
	"cvv": "123"
}
```

---

### User Routes

#### POST /user/

**Validation:**

```json
{
	"login": "string (4-255 chars, LOGIN_REGEX)",
	"password": "string (4-255 chars)",
	"firstname": "string (SINGLE_UNICODE_WORD_REGEX)",
	"secondname": "string (SINGLE_UNICODE_WORD_REGEX)",
	"phone": "string (10 digits)",
	"email": "string (valid email)"
}
```

**Example:**

```json
{
	"login": "user123",
	"password": "securePass123",
	"firstname": "Иван",
	"secondname": "Петров",
	"phone": "1234567890",
	"email": "user@example.com"
}
```

#### POST /user/login

**Body:**

```json
{
	"login": "string",
	"password": "string"
}
```

**Response:**

```json
{
	"status": "OK",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6MSwibG9naW4iOiJpbGxvcHJpbiIsImlhdCI6MTc0NjgxNTAwNCwiZXhwIjoxNzQ2OTAxNDA0fQ.-Ud16ovvIJyI_9kaGeZa1lcYM2u47kbRuVnSEa48OWA"
}
```

#### GET /user

**Requires:** Authorization
**Response:**

```json
{
	"status": "OK",
	"user": {
		"id": 2,
		"login": "illoprin",
		"firstname": "Шалтай",
		"secondname": "Кунцевич",
		"phone": "9198192998",
		"email": "illoprin@gmail.com",
		"password": "$2b$04$SQ.j4HCah.Hcr2DvthQWDeKbzIs04HpbJK.crAS1T1/ZKyvXPEhpe",
		"avatarpath": "/upload/protected/8383fb98-d36b-418e-b549-d2f5832ee414.jpg",
		"role": 1,
		"level": "Basic"
	}
}
```

#### PUT /user/

**Requires:** Authorization  
**Validation:** (same as POST, all fields optional)

```json
{
	"login?": "string",
	"password?": "string",
	"firstname?": "string",
	"secondname?": "string",
	"phone?": "string",
	"email?": "string"
}
```

#### POST /user/notification/:user_id

**Requires:** Authorization, Moderator role

**Body:**

```json
{
	"title": "string",
	"body": "string",
	"image": "url"
}
```
