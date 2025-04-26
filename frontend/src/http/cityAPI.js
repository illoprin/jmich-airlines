import { SERVER_URL } from "@/utils/config";
import { axios_delete_proxy, axios_post_proxy } from ".";

export const fetch_city = (app) => {
	return new Promise((resolve, reject) => {
			app.axios.get(SERVER_URL + '/city')
			.then(res => {
				if (res.status == 200) {
					resolve(res.data);
				} else {
					reject(res.data.message);
				}
			});
	});
}

export const add_city = (app, data) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/city/';
	return axios_post_proxy(app, url, token, data);
}

export const delete_city = (app, id) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/city/' + id;
	return axios_delete_proxy(app, url, token);
}