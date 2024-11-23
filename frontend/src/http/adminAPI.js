import { SERVER_URL } from "@/utils/config";
import { axios_get_proxy, axios_put_proxy, get_decode_token, axios_delete_proxy } from "@/http";

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
/* ======================================== */

/* ================ ADMIN ================ */
export const fetch_flight = async (app, limit) => {
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
/* ======================================== */