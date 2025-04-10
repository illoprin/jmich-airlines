const { Router } = require("express");
const tools = require('../tools.js');
const role_middleware = require("../middlewaree/role_middleware.js");
module.exports = (db) => {
	const router = new Router();

	router.get('/', async (req, res) => {
		const sql = 'SELECT * FROM city';
		try {
			const cities = await tools.query_promise(db, sql, []);
			res.send(cities);
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	// Admin: Add city
	router.post('/', role_middleware, async (req, res) => {
		const { name, airport_code } = req.body;
		const sql = 'INSERT INTO city (name, airport_code) VALUES (?, ?)';
		try {
			const insert = await tools.query_promise(db, sql, [name, airport_code]);
			res.send({ insert_id: insert.insertId });
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	// Admin: Remove city
	router.delete('/:id', role_middleware, async (req, res) => {
		const city_id = parseInt(req.params.id);
		const sql = 'DELETE FROM city WHERE id = ?';
		try {
			const result = await tools.query_promise(db, sql, [city_id]);
			res.send({ affected_rows: result.affectedRows });
		} catch (error) {
			res.status(500).json(tools.sql_error(error));
			throw error;
		}
	});

	return router;
}