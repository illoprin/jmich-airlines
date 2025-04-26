import { axios_get_proxy, axios_post_proxy, axios_put_proxy, axios_post, axios_get } from "@/http";
import { SERVER_URL } from "@/utils/config";

/* ================ FLIGHTS ================ */
export const search_flights = async (app, data) => {
	return await axios_post(app, SERVER_URL + '/flight/search', data);
}

export const add_flight = (app, data) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/flight';
	return axios_post_proxy(app, url, token, data);
};

export const get_all_flights = async (app, limit = 0) => {
	return await axios_get(app, SERVER_URL + '/flight/all/' + limit);
}
/* ============================================== */


