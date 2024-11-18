import { jwtDecode } from "jwt-decode";
import { SERVER_URL } from "./config";


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
				'Authorization': ('Bearer ' + token)
			}
		})
		.then(res => {
			console.log(`Responce:`);
			console.log(res);
			if (res.status == 200) {
				resolve(res.data.status);
			} else {
				reject(res.data.status);
			}
		});
	});
}

export const get_decode_token = () => {
	const token = localStorage.getItem('token');
	return jwtDecode(token);
};

export const authorizize_user = (responce) => {
	localStorage.setItem('token', responce.token);
	localStorage.setItem('authorized', true);
};

export const disauthorizize_user = () => {
	localStorage.setItem('token', null);
	localStorage.setItem('authorized', false);
};
/* ========================================== */




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

/* ====== ORDER / PURCHASE ====== */
export const get_order_list = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/purchase/' + decode.id;
	return axios_get_proxy(app, url, token);
}

export const get_order_data = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/purchase/' + decode.id;
	return axios_get_proxy(app, url, token);
}

export const add_order = (app, data) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/purchase/add/' + decode.id;
	return axios_post_proxy(app, url, token, data);
}

export const change_order_status = (app, id) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/purchase/cancel/' + id;
	return axios_put_proxy(app, url, token);
}

/* ==================================== */

/* ============== PAYMENT ============== */
export const get_payment_data = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/payment/' + decode.id;
	return axios_get_proxy(app, url, token);
}

export const add_payment_data = (app, data) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/payment/' + decode.id;
	return axios_post_proxy(app, url, token, data);
}

export const delete_payment_data = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/payment/' + decode.id;
	return axios_delete_proxy(app, url, token);
}
/* ==================================== */

/* ================== ADMIN ================== */
export const fetch_order = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/purchase/';
	return axios_get_proxy(app, url, token);
}
export const fetch_client = (app) => {
	const decode = get_decode_token();
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/';
	return axios_get_proxy(app, url, token);
}
export const get_user_profile = (app, client_id) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/user/' + client_id;
	return axios_get_proxy(app, url, token);
}

export const get_all_flights_regardless = async (app, limit) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/flight/all_reg/' + limit;
	return axios_get_proxy(app, url, token);
}
export const change_flight_status = async (app, id, status) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/flight/status/' + id;
	return axios_put_proxy(app, url, token, {status});
}
export const delete_flight = (app, id) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/flight/' + id;
	return axios_delete_proxy(app, url, token);
}

/* ============================================ */



/* ================ AXIOS PROXY ================ */ 
export const axios_get_proxy = (app, url, token) => {
	return new Promise((resolve, reject) => {
		app.axios.get(url, {
			headers: {
				'Authorization': 'Bearer ' + token
			}
		})
		.then(res => {
			console.log(res);
			if (res.status == 200) {
				resolve(res.data);
			} else {
				reject(res.data.message);
			}
		});
	});
}


export const axios_post_proxy = (app, url, token, data) => {
	return new Promise((resolve, reject) => {
		app.axios.post(url, data, {
			headers: {
				'Authorization': 'Bearer ' + token
			}
		})
		.then(res => {
			console.log(res);
			if (res.status == 200) {
				resolve(res.data);
			} else {
				reject(res.data.message);
			}
		});
	});
}

export const axios_delete_proxy = (app, url, token) => {
	return new Promise((resolve, reject) => {
		app.axios.delete(url, {
			headers: {
				'Authorization': 'Bearer ' + token
			}
		})
		.then(res => {
			console.log(res);
			if (res.status == 200) {
				resolve(res.data);
			} else {
				reject(res.data.message);
			}
		});
	});
}
export const axios_put_proxy = (app, url, token, data) => {
	return new Promise((resolve, reject) => {
		app.axios.put(url, data, {
			headers: {
				'Authorization': 'Bearer ' + token
			}
		})
		.then(res => {
			console.log(res);
			if (res.status == 200) {
				resolve(res.data);
			} else {
				reject(res.data.message);
			}
		});
	});
}
/* ======================================================== */



export const axios_post = (app, url, data) => {
	return new Promise((resolve, reject) => {
		app.axios.post(url, data)
		.then(res => {
			console.log(res);
			if (res.status == 200) {
				resolve(res.data);
			} else {
				reject(res.data.message);
			}
		});
	});
}

export const fetch_city = (app) => {
	return new Promise((resolve, reject) => {
			app.axios.get(SERVER_URL + '/city')
			.then(res => {
				if (res.status == 200) {
					resolve(res.data.result);
				} else {
					reject(res.data.message);
				}
			});
	});
}

/* ================ FLIGHTS ================ */
export const search_flights = (app, data) => {
	console.log(`Request:`);
	console.log(data);
	return new Promise((resolve, reject) => {
		app.axios.post(SERVER_URL + '/flight/search', data)
		.then(res => {
			console.log(`Responce:`);
			console.log(res);
			if (res.status == 200) {
				resolve(res.data.result);
			} else {
				reject(res.data.message);
			}
		});
	});
}

export const get_all_flights = (app, limit = 0) => {
	return new Promise((resolve, reject) => {
		app.axios.get(SERVER_URL + '/flight/all/' + limit)
		.then(res => {
			console.log(`Responce:`);
			console.log(res);
			if (res.status == 200) {
				resolve(res.data.result);
			} else {
				reject(res.data.message);
			}
		});
	});
}
/* ============================================== */

