const { Router } = require("express");
const tools = require('../tools.js');
const auth_middleware = require("../middlewaree/auth_middleware.js");
const role_middleware = require("../middlewaree/role_middleware.js");

module.exports = (db) => {
	const router = new Router();

	// Admin: add new promocode
	router.post('/', role_middleware, async (req, res) => {
		try {
			const {code, discount} = req.body;

			const sql = 'INSERT INTO promo_code (code, discount) VALUES (?, ?)';
			const post_result = await tools.query_promise(db, sql, [code, discount]);

			res.send({ insert_id: post_result.insertId });
		} catch (e) {
			res.status(500).json(tools.sql_error(e));
			throw e;
		}

	});

	router.post('/verify', auth_middleware, async (req, res) => {
		const { code } = req.body;
		try {
			let sql = 'SELECT * FROM promo_code WHERE code = ?';
			const promo_row = await tools.query_promise(db, sql, [code]);
			if (promo_row.length > 0) {
				res.send({ discount: promo_row[0].discount });
			} else {
				res.status(403).json(tools.res_error(`Промо код ${code} не действителен`));
			}
		} catch (e) {
			res.status(500).json(tools.sql_error(e));
			throw e;
		}
	});

	return router;
}