const { Router } = require("express");
const tools = require('../tools.js');
const auth_middleware = require("../middlewaree/auth_middleware.js");
const role_middleware = require("../middlewaree/role_middleware.js");
const personal_data_middleware = require("../middlewaree/personal_data_middleware.js");

const qr = require('../service/qr_controller.js');
const upload = require('../service/file_buffer.js');


module.exports = (db) => {
	const router = new Router();

	router.post('/add/:client_id', personal_data_middleware, async (req, res) => {
		const {flight_id, seats, total_cost} = req.body;
		const client_id = parseInt(req.params.client_id);

		try {
			// Get flight data to gen QR
			let sql = `
				SELECT
					route_code
				FROM
					flight
				WHERE
					id = ?`;
			const route = (await tools.query_promise(db, sql, [flight_id]))[0].route_code;
			// Generate random gate number
			const char_set = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ';
			const gate = char_set.charAt(Math.floor(Math.random() * char_set.length)) + Math.floor(Math.random() * 9);
			// Generate QR Buffer
			const qr_data = qr.prepare_encode_data({
				gate, route, cost: total_cost, seats
			});
			const qr_buffer = await qr.generate_qr_buffer(qr_data);
			// Save QR Buffer to file, receiving url
			const qr_url = await upload.save_buffer_to_file(qr_buffer);

			// Add purchase data
			sql = `
				INSERT INTO purchase
					(client_id, flight_id, total_cost, seats_purchased, qr_url)
				VALUES
					(?, ?, ?, ?, ?)`;
			const purchase = await tools.query_promise(db, sql, [client_id, flight_id, total_cost, seats, qr_url]);
			const purchase_id = purchase.insertId;
			sql = 'UPDATE flight SET seats_available = seats_available - ? WHERE id = ?';
			const flight = await tools.query_promise(db, sql, [seats, flight_id]);
			const affected_rows = flight.affectedRows;
			res.send({ qr: qr_url, insert_id: purchase.insertId });
		} catch (error) {
			res.send(500).json(tools.sql_error(error));
			throw error;
		}		
	});

	// Admin: GET ALL PURCHASES
	router.get('/', role_middleware, async (req, res) => {
		const sql = `
		SELECT
			user.id AS user_id,
			user.firstname,
			user.secondname,
			user.avatar_src,
			user.login,
			p.id AS purchase_id,
			p.qr_url AS qr,
			f.id AS flight_id,
			p.client_id,
			c.logo_src AS company_logo,
			departure.name AS departure_city,
			departure.airport_code AS departure_code,
			arrival.name AS arrival_city,
			arrival.airport_code AS arrival_code,
			f.departure_datetime,
			f.arrival_datetime,
			p.total_cost AS cost,
			f.route_code,
			f.status,
			p.seats_purchased AS seats,
			p.status AS purchase_status
		FROM
			purchase p
		JOIN
			flight f ON p.flight_id = f.id
		JOIN
			city departure ON f.departure_id = departure.id
		JOIN
			city arrival ON f.arrival_id = arrival.id
		JOIN
			company c ON f.company_id = c.id
		JOIN
			client user ON p.client_id = user.id
		ORDER BY p.created DESC`;
		
		try {
			let result = await tools.query_promise(db, sql, []);
			for (purchase of result) {
				purchase.departure_datetime = tools.parse_date(purchase.departure_datetime);
				purchase.arrival_datetime = tools.parse_date(purchase.arrival_datetime);
			}
			res.send(result);
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
		}
		

	});

	// Get order list
	router.get('/:client_id', personal_data_middleware, async (req, res) => {
		const client_id = Number(req.params.client_id);
		const sql = `
		SELECT
			p.id AS purchase_id,
			f.id AS flight_id,
			c.logo_src AS company_logo,
			departure.name AS departure_city,
			arrival.name AS arrival_city,
			departure.airport_code AS departure_code,
			arrival.airport_code AS arrival_code,
			f.departure_datetime,
			f.arrival_datetime,
			p.total_cost AS cost,
			f.route_code,
			f.status,
			p.seats_purchased AS seats,
			p.qr_url AS qr,
			p.status AS purchase_status
		FROM
			purchase p
		JOIN
			flight f ON p.flight_id = f.id
		JOIN
			city departure ON f.departure_id = departure.id
		JOIN
			city arrival ON f.arrival_id = arrival.id
		JOIN
			company c ON f.company_id = c.id
		WHERE
			p.client_id = ?;
		`
		try {
			const result = await tools.query_promise(db, sql, [client_id]);
			if (result.length > 0) {
				for (purchase of result) {
					purchase.departure_datetime = tools.parse_date(purchase.departure_datetime);
					purchase.arrival_datetime = tools.parse_date(purchase.arrival_datetime);
				}
				res.send({ purchase: result })
			} else {
				res.send({ purchase: [] })
			}
		} catch (err) {
			return res.status(500).json(tools.sql_error(err));
		}
	});

	router.put('/cancel/:id', auth_middleware, async (req, res) => {
		const purchase_id = parseInt(req.params.id);
		try {
			let sql = 'SELECT * FROM purchase WHERE id = ?';
			const purchase_data = (await tools.query_promise(db, sql, [purchase_id]))[0];
			const decoded_data = tools.parse_token(req)
			const client_id = decoded_data.id;
			if (purchase_data.client_id != client_id && decoded_data.role == 0) {
				return res.status(403).json(tools.res_error('Вы пытаетесь получить доступ к данным другого клиента. Доступ запрещён!'));
			}else {
				sql = 'UPDATE flight SET seats_available = seats_available + ? WHERE id = ?'
				const seats_restore = await tools.query_promise(db, sql, [purchase_data.seats_purchased, purchase_data.flight_id]);
				sql = 'UPDATE purchase SET status = ? WHERE id = ?';
				const cancel_result = await tools.query_promise(db, sql, [0, purchase_id]);
				res.send({ affected_rows: cancel_result.affectedRows });
			}
		} catch (err) {
			return res.status(500).json(tools.sql_error(err));
		}
	});

	router.delete('/:id', auth_middleware, async (req, res) => {
		const purchase_id = parseInt(req.params.id);
		try {
			let sql = 'SELECT * FROM purchase WHERE id = ?';
			const purchase_data = (await tools.query_promise(db, sql, [purchase_id]))[0];
			const decoded_data = tools.parse_token(req)
			const client_id = decoded_data.id;
			if (purchase_data.client_id != client_id && decoded_data.role == 0) {
				return res.status(403).json(tools.res_error('Вы пытаетесь получить доступ к данным другого клиента. Доступ запрещён!'));
			}else {
				sql = 'UPDATE flight SET seats_available = seats_available + ? WHERE id = ?'
				const seats_restore = await tools.query_promise(db, sql, [purchase_data.seats_purchased, purchase_data.flight_id]);
				sql = 'DELETE FROM purchase WHERE id = ?';
				const delete_result = await tools.query_promise(db, sql, [purchase_id]);
				res.send({ affected_rows: delete_result.affectedRows });
			}
		} catch (err) {
			return res.status(500).json(tools.sql_error(err));
		}
	});

	return router;

}