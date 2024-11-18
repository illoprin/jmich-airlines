const { Router } = require("express");
const tools = require('../tools.js');
const file_buffer = require('../service/file_buffer.js');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const auth_middleware = require("../middlewaree/auth_middleware.js");
const role_middleware = require("../middlewaree/role_middleware.js");
const personal_data_middleware = require("../middlewaree/personal_data_middleware.js");

dotenv.config();

const salt = parseInt(process.env.SALT);

module.exports = (db) => {
	const router = new Router();

	// User data
	router.post("/", async (req, res) => {
		let responce = tools.res_standart();
		const data = req.body;
		try {
			let sql = "SELECT COUNT(*) AS count FROM client WHERE login = ? AND email = ?";
			const same_users = (await tools.query_promise(db, sql, [data.login, data.email]))[0];
			if (same_users.count == 0) {
				sql = 'INSERT INTO client (login, email, firstname, secondname, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
				const password_hash = bcrypt.hashSync(data.password, salt);
				const user = await tools.query_promise(db, sql, [data.login, data.email, data.firstname, data.secondname, data.phone, password_hash, data.role]);
				responce.id = user.insertId;
				res.send(responce);
			}else {
				res.status(400).json(tools.res_error('Пользовтели с таким логином и email уже существуют'));
			}
		} catch(error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.post("/verify", auth_middleware, (req, res) => {
		let responce = tools.res_standart();
		res.send(responce);
	})

	router.post("/login", async (req, res) => {
		// Login needs "login" and "password"
		let responce = tools.res_standart();
		const login = req.body.login;
		const password = req.body.password;
		
		try {
			const sql = 'SELECT * FROM client WHERE login = ?';
			const user = (await tools.query_promise(db, sql, [login]));
			if (user.length == 1) {
				// Valid case
				const valid_password = user[0].password;
				const compare = bcrypt.compareSync(password, valid_password);
				if (compare) {
					const id = user[0].id;
					// ROLES
					// 0 - user
					// 1 - admin
					const role = user[0].role;
					// Generate JWT token
					const token = tools.generate_access_token(
						{id, role},
						process.env.SECRET
					);
					responce.result = user[0];
					responce.result.token = token;
					responce.message = "Авторизация прошла успешно";
					res.send(responce);
				}else {
					// Invalid password
					res.status(403).json(tools.res_error('Введён не верный пароль'));
				}
			} else if (user.length > 1) {
				// Users with that login more then one
				res.status(409).json(tools.res_error('Найдено несколько пользователей с таким логином. Возможно, данные были повреждены'));
			} else {
				// There are no users with that login
				res.status(400).json(tools.res_error('Такого пользователя не существует'));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.get("/:client_id", personal_data_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const id = parseInt(req.params.client_id);
		try {
			let sql = 'SELECT * FROM client WHERE id = ?';
			let user_data = (await tools.query_promise(db, sql, [id]))[0];
			responce.result = user_data;
			res.send(responce);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	// Admin: get all users
	router.get("/", role_middleware, async (req, res) => {
		let responce = tools.res_standart();
		try {
			let sql = 'SELECT * FROM client WHERE role = 0';
			let user_data = await tools.query_promise(db, sql, []);
			responce.result = user_data;
			res.send(responce);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.put("/:client_id", personal_data_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const client_id = parseInt(req.params.client_id);
		const { login, firstname, secondname, email, phone } = req.body;
		const sql = 'UPDATE client SET login = ?, firstname = ?, secondname = ?, email = ?, phone = ? WHERE id = ?';
		try {
			const update_data = await tools.query_promise(db, sql, [login, firstname, secondname, email, phone, client_id]);
			responce.affected_rows = update_data.affectedRows;
			res.send(responce);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.post("/avatar/:client_id", personal_data_middleware, async (req, res) => {
		let response = tools.res_standart();
		const client_id = parseInt(req.params.client_id);
		const sql = 'UPDATE client SET avatar_src = ? WHERE id = ?';
		try {
			const image_url = file_buffer.upload_image(req);
			await tools.query_promise(db, sql, [image_url, client_id]);
			res.send(response);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, response));
			throw error;
		}
	});

	router.delete("/:client_id", personal_data_middleware, (req, res) => {
		let responce = tools.res_standart();
		const id = req.params.client_id;
		const sql = "DELETE FROM client WHERE id = ?";
		db.query(sql, [id], (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce));
			else responce.affected_rows = rsl.affectedRows;
		});
		res.send(responce);
	});
	// end

	// Payment data
	router.post('/payment/:client_id', personal_data_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const client_id = parseInt(req.params.client_id);
		try {
			let sql = 'SELECT COUNT(*) AS count FROM payment WHERE client_id = ?';
			const payment = (await tools.query_promise(db, sql, [client_id]))[0];
			if (payment.count == 0) {
				sql = 'INSERT INTO payment (client_id, card_number, card_date, card_cvv) VALUES (?, ?, ?, ?)';
				const add_payment = await tools.query_promise(db, sql, [client_id, req.body.card_number, req.body.card_date, req.body.card_cvv]);
				responce.affected_rows = add_payment.affectedRows;
				res.send(responce);
			}else {
				res.status(409).json(tools.res_error(`Данные банковской карты для пользователя c id = ${client_id} уже введены`));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.put('/payment/:client_id', personal_data_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const client_id = parseInt(req.params.client_id);
		try {
			let sql = 'SELECT COUNT(*) AS count FROM payment WHERE client_id = ?';
			const payment = (await tools.query_promise(db, sql, [client_id]))[0];
			if (payment.count > 0) {
				sql = 'UPDATE payment SET card_number = ?, card_date = ?, card_cvv = ? WHERE client_id = ?';
				const payment_update = await tools.query_promise(db, sql, [req.body.card_number, req.body.card_date, req.body.card_cvv, client_id]);
				responce.affected_rows = payment_update.affectedRows;
				res.send(responce);
			} else {
				res.status(409).json(tools.res_error(`Записей о банковской карте для пользователя c id = ${client_id} не существует. Обновление не возможно`));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.get("/payment/:client_id", personal_data_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const client_id = parseInt(req.params.client_id);
		try {
			const sql = 'SELECT id, card_number, card_date, card_cvv FROM payment WHERE client_id = ?';
			const payment = await tools.query_promise(db, sql, [client_id]);
			if (payment.length >= 1) {
				// Если хочешь добавить возможность для клиента добавлять несколько банковских карт, то просто удали [0]
				responce.result = payment[0];
				res.send(responce);
			} else {
				res.send(tools.res_error(`Записей о банковской карте для пользователя c id = ${client_id} не существует.`));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	router.delete("/payment/:client_id", personal_data_middleware, (req, res) => {
		let responce = tools.res_standart();
		const id = req.params.client_id;
		const sql = "DELETE FROM payment WHERE client_id = ?";
		db.query(sql, [id], (err, rsl) => {
			if (err) res.status(500).json(tools.sql_error(err, responce));
			else responce.affected_rows = rsl.affectedRows;
		});
		res.send(responce);
	});
	// end

	return router;
};
