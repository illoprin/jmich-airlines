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
		const data = req.body;
		try {
			let sql = "SELECT COUNT(*) AS count FROM client WHERE login = ? AND email = ?";
			const same_users = (await tools.query_promise(db, sql, [data.login, data.email]))[0];
			if (same_users.count == 0) {
				sql = 'INSERT INTO client (login, email, firstname, secondname, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
				const password_hash = bcrypt.hashSync(data.password, salt);
				const user = await tools.query_promise(db, sql, [data.login, data.email, data.firstname, data.secondname, data.phone, password_hash, data.role]);
				res.send({ id: user.insertId });
			}else {
				res.status(400).json(tools.res_error('Пользовтели с таким логином и email уже существуют'));
			}
		} catch(error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.post("/verify", auth_middleware, (req, res) => {
		res.send({ status: 0 });
	})

	router.post("/login", async (req, res) => {
		// Login needs "login" and "password"
		const { login, password } = req.body;
		
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
					const result = user[0];
					res.send({ result, token });
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
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.get("/:client_id", personal_data_middleware, async (req, res) => {
		const id = parseInt(req.params.client_id);
		try {
			let sql = 'SELECT * FROM client WHERE id = ?';
			let user_data = (await tools.query_promise(db, sql, [id]))[0];
			res.send({result: user_data});
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	// Admin: get all users
	router.get("/", role_middleware, async (req, res) => {
		try {
			let sql = 'SELECT * FROM client WHERE role = 0';
			let user_data = await tools.query_promise(db, sql, []);
			res.send({result: user_data});
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.put("/:client_id", personal_data_middleware, async (req, res) => {
		const client_id = parseInt(req.params.client_id);
		const { login, firstname, secondname, email, phone } = req.body;
		const sql = 'UPDATE client SET login = ?, firstname = ?, secondname = ?, email = ?, phone = ? WHERE id = ?';
		try {
			const update_data = await tools.query_promise(db, sql, [login, firstname, secondname, email, phone, client_id]);
			res.send({ affected_rows: update_data.affectedRows});
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.post("/avatar/:client_id", personal_data_middleware, async (req, res) => {
		const { image } = req.files;
		const client_id = parseInt(req.params.client_id);
		const sql = 'UPDATE client SET avatar_src = ? WHERE id = ?';
		try {
			const image_url = file_buffer.upload_file(image);
			if (!image_url) 
				return res.status(400).json(tools.res_error('Файл не может быть загружен. Размер файла не должен превышать 10 МБ и расширение должно удовлетворять формату.'));

			await tools.query_promise(db, sql, [image_url, client_id]);
			res.send({ status: 1 });
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.delete("/:client_id", personal_data_middleware, async (req, res) => {
		const id = Number(req.params.client_id);
		const sql = "DELETE FROM client WHERE id = ?";
		try {
			const delete_result = await tools.query_promise(db, sql, id);
			res.send({ affected_rows: delete_result.affectedRows });
		} catch (err) {
			return res.status(500).json(tools.sql_error(err));
		}
	});
	// end

	// Payment data
	router.post('/payment/:client_id', personal_data_middleware, async (req, res) => {
		const client_id = parseInt(req.params.client_id);
		try {
			let sql = 'SELECT COUNT(*) AS count FROM payment WHERE client_id = ?';
			const payment = (await tools.query_promise(db, sql, [client_id]))[0];
			if (payment.count == 0) {
				sql = 'INSERT INTO payment (client_id, card_number, card_date, card_cvv) VALUES (?, ?, ?, ?)';
				const add_payment = await tools.query_promise(db, sql, [client_id, req.body.card_number, req.body.card_date, req.body.card_cvv]);
				res.send({ status: 0, affected_rows: add_payment.affectedRows });
			}else {
				res.status(409).json(tools.res_error(`Данные банковской карты для пользователя c id = ${client_id} уже введены`));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.put('/payment/:client_id', personal_data_middleware, async (req, res) => {
		const client_id = parseInt(req.params.client_id);
		try {
			let sql = 'SELECT COUNT(*) AS count FROM payment WHERE client_id = ?';
			const payment = (await tools.query_promise(db, sql, [client_id]))[0];
			if (payment.count > 0) {
				sql = 'UPDATE payment SET card_number = ?, card_date = ?, card_cvv = ? WHERE client_id = ?';
				const payment_update = await tools.query_promise(db, sql, [req.body.card_number, req.body.card_date, req.body.card_cvv, client_id]);
				res.send({ affected_rows: payment_update.affectedRows });
			} else {
				res.status(409).json(tools.res_error(`Записей о банковской карте для пользователя c id = ${client_id} не существует. Обновление не возможно`));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.get("/payment/:client_id", personal_data_middleware, async (req, res) => {
		const client_id = parseInt(req.params.client_id);
		try {
			const sql = 'SELECT id, card_number, card_date, card_cvv FROM payment WHERE client_id = ?';
			const payment = await tools.query_promise(db, sql, [client_id]);
			if (payment.length >= 1) {
				// Если хочешь добавить возможность для клиента добавлять несколько банковских карт, то просто удали [0]
				res.send({ status: 0, result: payment[0] });
			} else {
				res.send(tools.res_error(`Записей о банковской карте для пользователя c id = ${client_id} не существует.`));
			}
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	router.delete("/payment/:client_id", personal_data_middleware, async (req, res) => {
		const id = Number(req.params.client_id);
		const sql = "DELETE FROM payment WHERE client_id = ?";
		try {
			const delete_result = await tools.query_promise(db, sql, [id]);
			res.send({affected_rows: delete_result.affectedRows});
		} catch (err) {
			return res.status(500).json(tools.sql_error(err));
		}
	});
	// end

	return router;
};
