import { SERVER_URL } from "@/utils/config";
import { axios_delete_proxy, axios_get, axios_post_proxy } from ".";

export const get_company_all = (app) => {
	const url = SERVER_URL + '/company/';
	return axios_get (app, url)
}

export const add_company = (app, data) => {
	const token = localStorage.getItem('token');
	const formData = new FormData();
	for (const [key, value] of Object.entries(data))
		formData.append(key, value);
	const url = SERVER_URL + '/company/';
	return axios_post_proxy (app, url, token, formData);
}

export const remove_company = (app, id) => {
	const token = localStorage.getItem('token');
	const url = SERVER_URL + '/company/' + id;
	return axios_delete_proxy (app, url, token);
}