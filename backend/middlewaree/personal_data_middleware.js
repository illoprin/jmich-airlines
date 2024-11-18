const jwt = require('jsonwebtoken');
const tools = require('../tools.js');
const dotenv = require('dotenv');

dotenv.config();
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            res.status(401).json(tools.res_error('Пользователь не авторизован'));
            return;
        }
        const decoded_data = jwt.verify(token, process.env.SECRET);
		if ((decoded_data.id != req.params.client_id) && decoded_data.role != 1) {
			res.status(403).json(tools.res_error('Вы пытаетесь изменить или получить доступ к данным другого клиента.'));
            return;
		}
		req.client = decoded_data;
		next();
    }catch (e) {
        console.log(e);
        res.status(401).json(tools.res_error('Пользователь не авторизован'));
        return;
    }

};