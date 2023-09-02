import './assets/main.css';
window.global ||= window;
import { idx } from '@/database/IDX';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import JsonViewer from 'vue-json-viewer';
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import typescript from 'highlight.js/lib/languages/typescript';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import App from './App.vue';
import router from './router';

hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('typescript', typescript);

idx.start();

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(JsonViewer);
app.use(hljsVuePlugin);
app.mount('#app');
