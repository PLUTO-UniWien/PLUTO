import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/home/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/login/Login.vue'),
  },
  {
    path: '/survey',
    name: 'Survey',
    // route level code-splitting
    // this generates a separate chunk (survey.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "survey" */ '../views/survey/Survey.vue'),
  },
  {
    path: '/result',
    name: 'Result',
    component: () =>
      import(/* webpackChunkName: "result" */ '../views/result/Result.vue'),
  },
  {
    path: '/appendix',
    name: 'Appendix',
    component: () =>
      import(/* webpackChunkName: "appendix" */ '../views/appendix/Appendix.vue'),
  },
  {
    path: '/glossary',
    name: 'Glossary',
    component: () =>
      import(/* webpackChunkName: "glossary" */ '../views/glossary/Glossary.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
