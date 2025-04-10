const QRCode = require('qrcode');

// Data - json object
const prepare_encode_data = (data) => {
	let str = '';

	for (const [key, value] of Object.entries(data)) {
		// Substring - выводит строку от указанной буквы
		// Индекс первой буквы - 0, соответственно, если в аргументах указать 1
		// То функция выведет всю строку, начиная со второй буквы включительно
		let label = key.charAt(0).toUpperCase() + key.substring(1);
		let text = value;
		// если в значениях попадается число, то вероятно была передана цена
		// Число форматируется под цену, добавляется пробел между тысячами и символ валюты
		if (typeof text === 'number') {
			text = parseFloat(text).toLocaleString('ru') + ' ₽';
		}

		str += `${label} — ${text}\n`;
	}

	return str;
};

// Data - string
const generate_qr_buffer = async (data) => {

	const qr_options = {
		errorCorrectionLevel: 'M',
		type: 'image/png',
		margin: 2
	};

	try {
		const qr_buffer = await QRCode.toBuffer(data, qr_options);
		console.log('QR Buffer Generated Successfully');
		return qr_buffer;
	} catch (e) {
		console.log(e.message);
		throw new Error('Error generating QR code');
	}

};

module.exports = {
	prepare_encode_data,
	generate_qr_buffer,
}


