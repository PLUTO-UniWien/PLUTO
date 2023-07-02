import Vue from 'vue';
import Vuex from 'vuex';
import layout, { LayoutState } from './modules/layout';
import survey, { SurveyState } from './modules/survey';
import result, { ResultState } from './modules/result';
import submission, { SubmissionState } from './modules/submission';

Vue.use(Vuex);

export interface RootState {
  layout: LayoutState;
  survey: SurveyState;
  result: ResultState;
  submission: SubmissionState;
}

const store = new Vuex.Store({
  modules: {
    layout,
    survey,
    result,
    submission,
  },
});

export default store;
