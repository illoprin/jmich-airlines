import { SERVER_URL } from "@/utils/config";
import { axios_get_proxy, axios_post_proxy, axios_put_proxy, get_decode_token } from "@/http";

/* ============== AUTHORIZATION ============== */

export const check_auth = async (app) => {
	try {
		const token = localStorage.getItem('token');
		if (token) {
			const status = await verify_token(app, token);
			return status == 0 ? true : false;
		} else {
			return false;
		}
	} catch (e) {
		console.error('Возможны проблемы с соединением. Ошибка ' + e.message);
		return undefined;
	}
};

export const get_role = () => {
	const decoded_token_data = get_decode_token();
	if (decoded_token_data) {
		// 0 - client
		// 1 - admin
		return decoded_token_data.role;
	}
};

export const verify_token = (app, token) => {
	return new Promise((resolve, reject) => {
		const url = SERVER_URL + '/user/verify';
		console.log(`Request: ${url}`);
		app.axios.post(url, {}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		})
		.then(res => {
			console.log(`Responce:`);
			console.log(res);
			if (res.status == 200) {
				resolve(res.data.status);
			} else {
				reject(res.data.message);
			}
		});
	});
}

/* ============================================ */

/* ========== USER ========== */
export const delete_user = (app) => {
	const token = localStorage.getItem('token');
	const decode = get_decode_token();
	const url = SERVER_URL + '/user/' + decode.id;
	console.log('Delete user id = ' + decode.id);

	// Axios DELETE
	return new Promise ((resolve, reject) => {
		app.axios.delete(url, {
			headers: {
				'Authorization': 'Bearer ' + token
			}
		})
		.then(res => {
			console.log(res);
			if (res.status == 200) {
				resolve(res.data.result);
				localStorage.setItem('authorized', false);
				localStorage.setItem('token', null);
			} else {
				reject(res.data.message);
			}
		});
	});
};
export const get_user_data = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/' + decode.id;
	return axios_get_proxy(app, url, token);
}
export const update_user_data = (app, data) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/' + decode.id;
	return axios_put_proxy(app, url, token, data);
}
export const user_upload_avatar = (app, data) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/avatar/' + decode.id;
	return axios_post_proxy(app, url, token, data);
}
/* ==================================== */


/* ================ CLIENT ================== */
export const authorizize_user = (responce) => {
	localStorage.setItem('token', responce.token);
	localStorage.setItem('authorized', true);
};

export const disauthorizize_user = () => {
	localStorage.setItem('token', null);
	localStorage.setItem('authorized', false);
};
/* ========================================== */