// Import VUE app module
import { createApp } from 'vue';
import App from './App.vue';

// Import VUE Router
import router from './router';

// Import server query system axios
import axios from 'axios';
import VueAxios from 'vue-axios';

// Import custom CSS
import './assets/style/main.css';
import { check_auth, get_role } from './utils/api';

// Import datepicker module
// import './vendor/datepicker/dist/datepicker.js';
// import './vendor/datepicker/dist/css/datepicker.minimal.css';

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

router.beforeEach((to, from) => {
	const is_auth = localStorage.getItem('authorized');
	if (to.meta.require_auth && is_auth === 'false') {
		return {
			name: 'auth-login',
		};
	}else {
		if (to.meta.require_admin && (get_role() == 0)) {
			return {
				name: 'search',
			};
		}
	}
});


app.mount('#app');
