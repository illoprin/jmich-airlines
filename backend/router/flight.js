const { Router } = require("express");
const tools = require('../tools.js');
const auth_middleware = require("../middlewaree/auth_middleware.js");
const role_middleware = require("../middlewaree/role_middleware.js");

function flight_parse_result(rsl, limit) {
	let num = 0;
	let current_page = 0;
	if (rsl.length > 0) {
		for (let i = 0; i < rsl.length; i++) {
			let flight = rsl[i];
			flight.cheapest = false;
			flight.departure_datetime = tools.parse_date(flight.departure_datetime);
			flight.arrival_datetime = tools.parse_date(flight.arrival_datetime);
			if (limit != 0) {
				num++;
				if (num > limit) {
					current_page++;
					num = 0;
				}
				flight.page = current_page;
			}
		}
	}
}

module.exports = (db) => {
	const router = new Router();

	const update_flights = (db) => {
		const sql = `
			UPDATE flight SET
				status = 0
			WHERE
				departure_datetime <= CURRENT_TIMESTAMP
				AND status = 1
			`;
		db.query(sql, (err, rsl) => {
			if (err) throw new Error ('Error while updating flights ' + err.message);
		});
	}
	

	// Admin
	router.post('/', role_middleware, (req, res) => {
		let responce = tools.res_standart();
		/*
		Format:
		{
			"company_id": ...,
			"departure_id": ...,
			"arrival_id": ...,
			"departure_datetime": ...,
			"arrival_datetime": ...,
			"seats_available": ...,
			"price": ...,
			"route_code": ...
		}
		*/
		let data = [];
		for (const [key, value] of Object.entries(req.body))
			data.push(value);
		const sql = `
			INSERT INTO flight
				(company_id, departure_id, arrival_id, departure_datetime, arrival_datetime, seats_available, price, route_code)
			VALUES
				(?, ?, ?, ?, ?, ?, ?, ?)`;
		db.query(sql, data, (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce));
			else responce.result = rsl.affectedRows;
			res.send(responce);
		});
	});

	router.get('/all/:limit', (req, res) => {
		let responce = tools.res_standart();
		const { limit } = req.params;
		const sql = `
			SELECT
				f.id,
				c.name AS company_name,
				c.logo_src AS company_logo,
				departure.name AS departure_city,
				departure.airport_code AS departure_code,
				arrival.name AS arrival_city,
				arrival.airport_code AS arrival_code,
				f.departure_datetime,
				f.arrival_datetime,
				f.seats_available,
				f.price,
				f.route_code,
				f.status
			FROM
				flight f
			JOIN company c ON
				f.company_id = c.id
			JOIN city departure ON
				f.departure_id = departure.id
			JOIN city arrival ON
				f.arrival_id = arrival.id
			WHERE
				f.status = 1
			ORDER BY f.departure_datetime;
		`;

		db.query(sql, (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce))
			else {
				flight_parse_result(rsl, limit);
				responce.result = rsl;
			} 
			res.send(responce);
		});
	});

	// Admin ALL REGARDLESS
	router.get('/all_reg/:limit', role_middleware, (req, res) => {
		let responce = tools.res_standart();
		const { limit } = req.params;
		const sql = `
			SELECT
				f.id,
				c.name AS company_name,
				c.logo_src AS company_logo,
				departure.name AS departure_city,
				departure.airport_code AS departure_code,
				arrival.name AS arrival_city,
				arrival.airport_code AS arrival_code,
				f.departure_datetime,
				f.arrival_datetime,
				f.seats_available,
				f.price,
				f.route_code,
				f.status
			FROM
				flight f
			JOIN company c ON
				f.company_id = c.id
			JOIN city departure ON
				f.departure_id = departure.id
			JOIN city arrival ON
				f.arrival_id = arrival.id
			ORDER BY f.departure_datetime
		`;

		db.query(sql, (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce))
			else {
				flight_parse_result(rsl, limit);
				responce = rsl;
			} 
			res.send(responce);
		});
	});

	router.get('/:flight_id', auth_middleware, (req, res) => {
		let responce = tools.res_standart();
		const flight_id = parseInt(req.params.flight_id);
		const sql = `
			SELECT
				f.id,
				c.name AS company_name,
				c.logo_src AS company_logo,
				departure.name AS departure_city,
				departure.airport_code AS departure_code,
				arrival.name AS arrival_city,
				arrival.airport_code AS arrival_code,
				f.departure_datetime,
				f.arrival_datetime,
				f.seats_available,
				f.price,
				f.route_code,
				f.status
			FROM
				flight f
			JOIN company c ON
				f.company_id = c.id
			JOIN city departure ON
				f.departure_id = departure.id
			JOIN city arrival ON
				f.arrival_id = arrival.id
			WHERE
				f.id = ?
		`;
		db.query(sql, [flight_id], (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce));
			else {
				flight_parse_result(rsl, 0);
				responce.result = rsl;
			} 
			res.send(responce);
		});
	});
	
	router.post('/search', (req, res) => {
		let responce = tools.res_standart();
		console.log(req.body);
		const {departure_city, arrival_city, date, seats} = req.body;
		const sql = `
		SELECT
			f.id,
			c.name AS company_name,
			c.logo_src AS company_logo,
			departure.name AS departure_city,
			departure.airport_code AS departure_code,
			arrival.airport_code AS arrival_code,
			arrival.name AS arrival_city,
			f.departure_datetime,
			f.arrival_datetime,
			f.seats_available,
			f.route_code,
			f.price,
			f.status
		FROM
			flight f
		JOIN company c ON
			f.company_id = c.id
		JOIN city departure ON
			f.departure_id = departure.id
		JOIN city arrival ON
			f.arrival_id = arrival.id
		WHERE
			departure.name = ?
			AND arrival.name = ?
			AND f.departure_datetime >= DATE(?)
			AND ((f.seats_available - ?) >= 0)
			AND f.status = 1`;

		console.log(db.query(sql, [departure_city, arrival_city, date, seats], (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce))
			else {
				flight_parse_result(rsl);
				for (ticket of rsl)
					ticket.price *= seats;
				responce.result = rsl;
			}
			res.send(responce);
		}).sql);
	});
	

	// Admin - add random fields
	router.post('/random', role_middleware, async (req, res) => {
		let response = tools.res_standart();
		// Создание случайных перелётов для тестирования сервиса
		// Принцип работы рандомайзера:
		// Сначала берём все города и создаём связи между ними
		// При создании связи создаём поле date
		// departure time - каждый день на X дней вперёд
		// Время перелёта случайное - от одного часа до одного дня
		const { days, daily_flights } = req.body;
		try {
			const cities = await tools.query_promise(db, 'SELECT id from city', []);
			const companies = await tools.query_promise(db, 'SELECT id from company', []);

			const current_day = new Date().getTime();

			let flights = [];
			const char_set = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ';
			// Количество миллисекунд в одном часе
			const mH = 3600000;

			for (let i = 0; i < days; i++) {
				for (let d = 0; d < daily_flights; d++) {
					const departure = current_day + (i * mH * 24) + (Math.random() * mH * 5);
					const arrival = departure + (mH * 2 + Math.random() * mH * 22);
					const route_code = char_set.charAt(Math.floor(Math.random() * char_set.length)) + Math.floor(Math.random() * 999);
					const a_city = cities[Math.floor(Math.random() * cities.length)].id;
					const r_city = cities[Math.floor(Math.random() * cities.length)].id;
					const b_city = r_city == a_city ? cities[Math.floor(Math.random() * cities.length)].id : r_city;
					flights.push({
						company_id: Number(companies[Math.floor(Math.random() * companies.length)].id),
						departure_id: Number(a_city),
						arrival_id: Number(b_city),
						departure_datetime: tools.convert_to_sql_date(departure),
						arrival_datetime: tools.convert_to_sql_date(arrival),
						seats_available: Math.floor(32+Math.random()*5),
						price: Math.floor(3000 + Math.random()*4000),
						route_code,
					});
				}
			}
			

			for (flight of flights) {
				let data = [];
				for (const [key, value] of Object.entries(flight))
					data.push(value);
				const sql = `
					INSERT INTO flight
						(company_id, departure_id, arrival_id, departure_datetime, arrival_datetime, seats_available, price, route_code)
					VALUES
						(?, ?, ?, ?, ?, ?, ?, ?)`;
				
				const insert_result = await tools.query_promise(db, sql, data);
			}
			res.send({ count: flights.length, flights });
			

		} catch (err) {
			if (err) return res.status(500).json(tools.sql_error(err, response))
		}

	});

	// Admin
	router.put('/status/:id', role_middleware, (req, res) => {
		let responce = tools.res_standart();
		const status = parseInt(req.body.status);
		const flight_id = parseInt(req.params.id);
		const sql = `UPDATE flight SET status = ? WHERE id = ?`;
		db.query(sql, [status, flight_id], (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce));
			else responce.affected_rows = rsl.affectedRows;
			res.send(responce);
		});
	});

	// Admin
	router.delete('/:id', role_middleware, (req, res) => {
		let responce = tools.res_standart();
		const flight_id = Number(req.params.id);
		const sql = "DELETE FROM flight WHERE id = ?";
		db.query(sql, [flight_id], (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce));
			else responce.affected_rows = rsl.affectedRows;
		});
		res.send(responce);
	});
	return {flight: router, update_flights};
}