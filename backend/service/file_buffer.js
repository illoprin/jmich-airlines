const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const tools = require('../tools');

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

const upload_file = (file, path = 'upload/user', allowed = ['jpg', 'png', 'jpeg', 'gif', 'tiff']) => {
	if (!file)
		return false;
	
	if (Buffer.byteLength(file.data) > tools.MAX_BUFFER_LENGTH) 
		return false;

	const file_name_splitted = file.name.split('.');
	const file_extension = file_name_splitted[file_name_splitted.length - 1];

	if (!allowed.includes(file_extension)) 
		return false;

	const file_name = `${uuidv4()}.${file_extension}`;
	file.mv(__dirname + `/../${path}/` + file_name);
	return `http://localhost:${process.env.PORT}/${path}/${file_name}`;
};

module.exports = {
	save_buffer_to_file,
	upload_file
}

