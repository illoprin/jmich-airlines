import { SERVER_URL } from "@/utils/config";
import { axios_delete_proxy, axios_get_proxy, axios_post_proxy } from ".";

export const add_promo = (app, data) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/promo/'
	return axios_post_proxy(app, url, token, data);
}

export const delete_promo = (app, id) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/promo/' + id
	return axios_delete_proxy(app, url, token);
}

export const get_all_promo = (app) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/promo/'
	return axios_get_proxy(app, url, token);
}