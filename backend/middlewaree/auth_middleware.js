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
            res.send(tools.res_error('Пользователь не авторизован'));
            return;
        }
        const decoded_data = jwt.verify(token, process.env.SECRET);
        req.client = decoded_data;
        next();
    }catch (e) {
        console.log(e);
        res.send(tools.res_error('Пользователь не авторизован'));
        return;
    }

};