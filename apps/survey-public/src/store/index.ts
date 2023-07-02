import Vue from 'vue';
import Vuex from 'vuex';
import layout, { LayoutState } from './modules/layout';
import survey, { SurveyState } from './modules/survey';
import result, { ResultState } from './modules/result';

Vue.use(Vuex);

export interface RootState {
  layout: LayoutState;
  survey: SurveyState;
  result: ResultState;
}

const store = new Vuex.Store({
  modules: {
    layout,
    survey,
    result,
  },
});

export default store;
