import { get_decode_token } from "@/http";
import { SERVER_URL } from "@/utils/config";
import { axios_get_proxy, axios_post_proxy, axios_delete_proxy } from "@/http";


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