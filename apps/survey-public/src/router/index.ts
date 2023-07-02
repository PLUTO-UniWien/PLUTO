import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Loading from '../views/loading/Loading.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Loading',
    component: Loading,
  },
  {
    path: '/home',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
