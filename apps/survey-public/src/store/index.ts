import Vue from 'vue';
import Vuex from 'vuex';
import layout, { LayoutState } from './modules/layout';

Vue.use(Vuex);

export interface RootState {
  layout: LayoutState;
}

const store = new Vuex.Store({
  modules: {
    layout,
  },
});

export default store;
