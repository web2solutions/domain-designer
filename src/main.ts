import './assets/main.css';
window.global ||= window;
import { idx } from '@/database/IDX'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

idx.start();

const app = createApp(App)

app.use(createPinia())
app.use(router)



app.mount('#app')
