import router from '@/router/router.ts';
import { createApp } from 'vue';
import App from '@/App.vue';
import '@/assets/style/App.css';
import '@/assets/style/Fonts.css'
import '@/assets/style/FormControl.css';
import '@/assets/style/Dropdown.css'
import '@/assets/style/Flight.css'
import { createPinia } from 'pinia';
import piniaPluginPersistentState from 'pinia-plugin-persistedstate';

// Create app instance
const app = createApp(App);
// Use router
app.use(router);

// Create pinia state manager instance
const pinia = createPinia();
// Add possability to store items in localStorage
pinia.use(piniaPluginPersistentState);

// Use pinia in app
app.use(pinia);
// Mount app to root DOM Element
app.mount('#app');
