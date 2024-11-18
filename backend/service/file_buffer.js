const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// receives: buffer, returns: file url
const save_buffer_to_file = (buffer) => {
	const file_name = `${uuidv4()}.png`;
	const file_path = path.join(__dirname, '../upload/codes', file_name);


	console.log(buffer);
	try {
		fs.writeFileSync(file_path, buffer);
		return `http://localhost:${process.env.PORT}/upload/codes/${file_name}`;
	} catch (e) {
		console.log("Error saving file", e.message);
		throw new Error('Error saving file ' + file_name);
	}
};

const upload_image = (req, path = 'upload/user') => {
	const { image } = req.files;
	if (!image) return res.send(400).json(tools.res_error('Файл не может быть загружен'));
	const file_name_splitted = image.name.split('.');
	const file_extension = file_name_splitted[file_name_splitted.length - 1];
	const file_name = `${uuidv4()}.${file_extension}`;
	image.mv(__dirname + `/../${path}/` + file_name);
	return `http://localhost:${process.env.PORT}/${path}/${file_name}`;
};

module.exports = {
	save_buffer_to_file,
	upload_image
}

