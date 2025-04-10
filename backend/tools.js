const jwt = require("jsonwebtoken");

module.exports = {
	sql_error: (err) => {
		return {
			message: `Ошибка при выполнении запроса в БД. Код ошибки: ${err.code}`,
		};
	},
	res_error: (message) => {
		return {
			status: 1,
			message: message,
		};
	},
	res_standart: () => {
		return {
			status: 0,
			message: "Запрос выполнен успешно",
		};
	},


	generate_access_token: (payload, key) => {
		return jwt.sign(payload, key, { expiresIn: "24h" });
	},
	parse_token: (req) => {
		const token = req.headers.authorization.split(' ')[1];
		return jwt.verify(token, process.env.SECRET);
	},


	convert_to_sql_date: (unix_time) => {
		const date = new Date(unix_time);

		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth()+1).padStart(2, '0'); // January is 0
		const year = date.getFullYear();
		const hour = String(date.getHours()).padStart(2, '0');
		const minute = String(date.getMinutes()).padStart(2, '0');
		const second = String(date.getSeconds()).padStart(2, '0');

		return `${year}-${month}-${day} ${hour}:${minute}:${second}` 
	},
	parse_date: (date) => {
		const day = date.getDate();
		const month = date.getMonth()+1; // January is 0
		const year = date.getFullYear();
		const hour = date.getHours();
		const minute = date.getMinutes();

		return {
			day, month, year, hour, minute
		} 
	},

	// bytes - 10mb
	MAX_BUFFER_LENGTH: 10_000_000,

	// async query promise
	query_promise: (db, sql, params = []) => {
		return new Promise((resolve, reject) => {
			db.query(sql, params, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
};
