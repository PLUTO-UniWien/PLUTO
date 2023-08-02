import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import './styles/bootstrap.scss';
import { initLayoutListener } from './store/modules/layout';
import contentVersion from './content-version';
import config from './config';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// Initialize listeners
initLayoutListener(store);

console.log(`Last content update: ${contentVersion}`);

// Attach `PLUTO_ENV` to `window` for debugging purposes
(window as typeof window & { PLUTO_ENV: typeof config }).PLUTO_ENV = config;
