import router from '@/router/router.ts';
import { createApp } from 'vue';
import App from '@/App.vue';
import '@/assets/style/App.css';
import '@/assets/style/Fonts.css'
import '@/assets/style/FormControl.css';
import '@/assets/style/Dropdown.css'

const app = createApp(App);
app.use(router);
app.mount('#app');
