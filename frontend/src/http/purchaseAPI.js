import { get_decode_token } from "@/http";
import { SERVER_URL } from "@/utils/config";
import { axios_get_proxy, axios_post_proxy, axios_put_proxy } from "@/http";

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