const { Router } = require("express");
const tools = require('../tools.js');
const auth_middleware = require("../middlewaree/auth_middleware.js");
const role_middleware = require("../middlewaree/role_middleware.js");

module.exports = (db) => {
	const router = new Router();

	// Admin: add new promocode
	router.post('/', role_middleware, async (req, res) => {
		let response = tools.res_standart();

		try {
			const {code, discount} = req.body;

			const sql = 'INSERT INTO promo_code (code, discount) VALUES (?, ?)';
			const post_result = await tools.query_promise(db, sql, [code, discount]);
			response.insert_id = post_result.insertId;

			res.send(response);
		} catch (e) {
			res.status(500).json(tools.sql_error(e, response));
			throw e;
		}

	});

	router.post('/verify', auth_middleware, async (req, res) => {
		const { code } = req.body;
		let response = tools.res_standart();
		try {
			let sql = 'SELECT * FROM promo_code WHERE code = ?';
			const promo_row = await tools.query_promise(db, sql, [code]);
			if (promo_row.length > 0) {
				response.message = 'Промо код действителен';
				response.discount = promo_row[0].discount;
				res.send(response);
			} else {
				res.status(403).json(tools.res_error(`Промо код ${code} не действителен`));
			}
		} catch (e) {
			res.status(500).json(tools.sql_error(e, response));
			throw e;
		}
	});

	return router;
}