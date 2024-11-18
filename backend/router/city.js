const { Router } = require("express");
const tools = require('../tools.js');
const role_middleware = require("../middlewaree/role_middleware.js");
module.exports = (db) => {
	const router = new Router();

	router.get('/', async (req, res) => {
		let responce = tools.res_standart();
		const sql = 'SELECT * FROM city';
		try {
			const cities = await tools.query_promise(db, sql, []);
			responce.result = cities;
			res.send(responce);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	// Admin
	// Add city
	router.post('/', role_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const city = req.body;
		const sql = 'INSERT INTO city (name, airport_code) VALUES (?, ?)';
		try {
			const insert = await tools.query_promise(db, sql, [city.name, city.airport_code]);
			responce.id = insert.insertId;
			res.send(responce);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	// Admin
	// Remove city
	router.delete('/:id', role_middleware, async (req, res) => {
		let responce = tools.res_standart();
		const city_id = parseInt(req.params.id);
		const sql = 'DELETE FROM city WHERE id = ?';
		try {
			const result = await tools.query_promise(db, sql, [city_id]);
			responce.affected_rows = result.affectedRows;
			res.send(responce);
		} catch (error) {
			res.status(500).json(tools.sql_error(error, responce));
			throw error;
		}
	});

	return router
}