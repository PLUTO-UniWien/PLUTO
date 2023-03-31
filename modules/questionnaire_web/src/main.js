import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import store from './store/store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/styles/main.css';
import Start from "@/components/Start.vue";
import Result from "@/components/Result.vue";
import Survey from "@/components/Survey.vue";

const routes = {
  '/': Start,
  '/survey': Survey,
  '/result': Result,
}

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

const app = new Vue({
  store,
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || Start
    }
  },
  render (h) {
    return h(this.ViewComponent)
  }
})

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})