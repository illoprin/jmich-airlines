import { SERVER_URL } from "@/utils/config";

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