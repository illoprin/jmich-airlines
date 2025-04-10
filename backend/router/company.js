const { Router } = require("express");
const tools = require('../tools.js');
const file_buffer = require('../service/file_buffer.js');
const role_middleware = require("../middlewaree/role_middleware.js");

module.exports = (db) => {
	const router = new Router();

	// Admin: add company
	router.post('/', role_middleware, async (req, res) => {
		let response = tools.res_standart();
		const { name } = req.body;
		const { logo } = req.files;

		try {
			const logo_url = file_buffer.upload_file(logo, 'upload');
			if (!logo_url) 
				return res.status(400).json(tools.res_error('Файл не может быть загружен. Размер файла не должен превышать 10 МБ и расширение должно удовлетворять формату.'));
			const sql = 'INSERT INTO company(name, logo_src) VALUES (?, ?)';
			const insert_result = await tools.query_promise(db, sql, [name, logo_url]);
			response.insert_id = insert_result.insertId;
			res.send(response);
		} catch (err) {
			return res.send(500).json(tools.sql_error(err));
		}
	});

	// Admin: get all companies
	router.get('/', async (req, res) => {
		try {
			const company = await tools.query_promise(db, 'SELECT * FROM company');
			res.send(company);
		} catch (err) {
			return res.send(500).json(tools.sql_error(err));
		}
	});

	// Admin: delete company
	router.delete('/:id', role_middleware, async (req, res) => {
		try {
			const id = Number(req.params.id);
			const delete_result = await tools.query_promise(db, 'DELETE FROM company WHERE id = ?', [id]);
			res.send({ affected_rows: delete_result.affectedRows });
		} catch (err) {
			return res.send(500).json(tools.sql_error(err));
		}
	});

	return router;
};