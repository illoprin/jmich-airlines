import router from '@/router/router.ts';
import { createApp } from 'vue';
import App from '@/App.vue';
import '@/assets/style/App.css';
import '@/assets/style/Fonts.css';
import '@/assets/style/FormControl.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
