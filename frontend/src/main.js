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
import { get_role } from '@/http/userAPI';

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