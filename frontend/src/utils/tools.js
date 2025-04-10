export const format = (clear_str, pattern = 'xxx xxx xx xx') => {
    let new_str = "";
	let offset = 0;
    clear_str = clear_str.trim();
	for (let i = 0; i < pattern.length; i++) {
		if (pattern.charAt(i) === "x")
			new_str += clear_str.charAt(i - offset) ? clear_str.charAt(i - offset) : "";
		else {
			new_str += pattern.charAt(i);
			offset++;
		}
	}
	return new_str;
};

export const redirect = (url) => {
	// Redirect
	window.location.href = url;
}


export const prepare_form_data = (data, needs_trim = false) => {
    let new_data = {};
    for (const [key, value] of Object.entries(data)) {
        let new_value = value.replace(/[^a-zA-z0-9а-яА-Я@.,&?]/g, "");
        new_data[key] = new_value;
    }
    return new_data;
};

export const parse_responce_date = (res_datetime) => {
    const {day, month, year, hour, minute} = res_datetime;
    return new Date(`${year}-${month}-${day} ${hour}:${minute}`);
};

export const date_to_locale = (date) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC'
    }
    return date.toLocaleDateString('ru-RU', options);
};

export const date_delta = (date_1, date_2) => {
    const date_1_m = date_1.getTime();
    const date_2_m = date_2.getTime();
    const delta = Math.abs(date_2_m - date_1_m);

    const mH = 3600000;
    let hours = delta / mH;
    const days = Math.floor(hours / 24);
    const minutes = Math.round((hours % 1) * 60);

    hours = Math.floor(hours);
    
    return {hours, days, minutes};
};

export const format_price = (raw) => {
    return parseFloat(raw).toLocaleString('ru') + " ₽";
};

export const has_empty_fields = (obj) => {
    let hasEmpty = false;
    for (const [key, value] of Object.entries(obj)) {
        hasEmpty = (!value || value == '') ? true : hasEmpty;
    }
    return hasEmpty;
}