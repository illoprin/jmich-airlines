import router from '@/router/router.ts';
import { createApp } from 'vue';
import App from '@/App.vue';
import './style/App.css';
import './style/Fonts.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
