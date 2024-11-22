import { jwtDecode } from "jwt-decode";

export const get_decode_token = () => {
	const token = localStorage.getItem('token');
	return jwtDecode(token);
};

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


/* =============== AXIOS STANDART ================== */
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
export const axios_get = (app, url) => {
	return new Promise((resolve, reject) => {
		app.axios.get(url)
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
/* ================================================ */




